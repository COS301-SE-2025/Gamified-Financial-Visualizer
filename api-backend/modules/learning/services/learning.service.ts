// learning.service.ts
import { Logger } from "winston";
import pool from "../../../config/db";
import { logger } from "../../../config/logger";

// 🧠 Get all learning modules
export async function getAllModules() {
  const query = `
    SELECT lm.*, COUNT(l.lesson_id) AS lesson_count
    FROM learning_modules lm
    LEFT JOIN lessons l ON lm.module_id = l.module_id
    GROUP BY lm.module_id
    ORDER BY lm.module_id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getCompletedModules(user_id: number) {
  try {
    // if user does not exist, return error
    const query = `
      SELECT 
        lm.*,
        COUNT(l.lesson_id) AS lesson_count
      FROM quizzes q
      JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
      JOIN learning_modules lm ON q.module_id = lm.module_id
      LEFT JOIN lessons l ON lm.module_id = l.module_id
      WHERE qa.user_id = $1 AND qa.passed = true
      GROUP BY lm.module_id
      ORDER BY lm.module_id ASC;
    `;
    const result = await pool.query(query, [user_id]);

    return result.rows
  } catch (error) {
    logger.error('Error fetching completed modules:', error);
    return {
      status: "error",
      message: "Failed to fetch completed modules"
    };
  }
}
    
export async function getUncompletedModules(user_id: number) {
  try {
    const query = `
      SELECT 
        lm.*,
        COUNT(l.lesson_id) AS lesson_count
      FROM learning_modules lm
      LEFT JOIN lessons l ON lm.module_id = l.module_id
      JOIN quizzes q ON lm.module_id = q.module_id
      WHERE NOT EXISTS (
        SELECT 1
        FROM quiz_attempts qa
        WHERE qa.quiz_id = q.quiz_id
          AND qa.user_id = $1
          AND qa.passed = true
      )
      GROUP BY lm.module_id
      ORDER BY lm.module_id ASC;
    `;
    
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching uncompleted modules:', error);
    return "Failed to fetch uncompleted modules";
  }
}

// 📘 Get a specific module by ID
export async function getModuleById(module_id: number) {
  const query = `SELECT * FROM learning_modules WHERE module_id = $1`;
  const result = await pool.query(query, [ module_id ]);
  return result.rows[ 0 ];
}

// 📚 Get all lessons under a specific module
export async function getLessonsByModule(module_id: number) {
  const query = `
    SELECT * FROM lessons
    WHERE module_id = $1
    ORDER BY lesson_number ASC
  `;
  const result = await pool.query(query, [ module_id ]);
  return result.rows;
}

// 📖 Get a specific lesson by ID
export async function getLessonById(lesson_id: number) {
  const query = `SELECT * FROM lessons WHERE lesson_id = $1`;
  const result = await pool.query(query, [ lesson_id ]);
  return result.rows[ 0 ];
}

// 📝 Get quiz for a specific module
export async function getQuizByModuleId(module_id: number) {
  const query = `
    SELECT * FROM quizzes
    WHERE module_id = $1
  `;
  const result = await pool.query(query, [ module_id ]);
  return result.rows;
}

// 🧪 Get specific quiz by ID
export async function getQuizById(quiz_id: number) {
  const query = `SELECT * FROM quizzes WHERE quiz_id = $1`;
  const result = await pool.query(query, [ quiz_id ]);
  return result.rows[ 0 ];
}

// 🧾 Submit a quiz attempt
export async function submitQuizAttempt(
  user_id: number,
  quiz_id: number,
  attempt_score: number,
  passed: boolean
) {
  // Get module difficulty for the quiz
  const moduleDifficultyQuery = `
    SELECT lm.difficulty
    FROM quizzes q
    JOIN learning_modules lm ON q.module_id = lm.module_id
    WHERE q.quiz_id = $1
    LIMIT 1;
  `;
  const difficultyResult = await pool.query(moduleDifficultyQuery, [quiz_id]);
  const difficulty = difficultyResult.rows[0]?.difficulty || 'beginner';

  // Assign points based on difficulty
  let pointsToAdd = 10;
  if (difficulty === 'intermediate') pointsToAdd = 20;
  else if (difficulty === 'advanced') pointsToAdd = 30;

  const attemptQuery = `
    INSERT INTO quiz_attempts (
      user_id, quiz_id, attempt_score, passed, attempt_number
    ) VALUES (
      $1, $2, $3, $4,
      COALESCE(
        (SELECT MAX(attempt_number) FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2), 0
      ) + 1
    )
    RETURNING *;
  `;

  // add points to user if they passed the quiz
  let alreadyPassed = false;
  if (passed) {
    const checkPassedQuery = `
      SELECT 1 FROM quiz_attempts
      WHERE user_id = $1 AND quiz_id = $2 AND passed = true
      LIMIT 1;
    `;
    const passedResult = await pool.query(checkPassedQuery, [user_id, quiz_id]);
    if (!passedResult?.rows) {
      throw new Error('Failed to check previous attempts');
    }
    alreadyPassed = passedResult.rows.length > 0;
  }
  
  if (passed && !alreadyPassed) {
    const checkQuery = `
      SELECT total_points FROM user_points WHERE user_id = $1;
    `;
    const { rows } = await pool.query(checkQuery, [ user_id ]);

    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO user_points (user_id, total_points) VALUES ($1, $2);`,
        [ user_id, pointsToAdd ]
      );
      logger.info(`[LearningService] Created points entry for user ${user_id}`);
    } else {
      await pool.query(
        `UPDATE user_points
         SET total_points = total_points + $2,
             last_updated = CURRENT_TIMESTAMP
         WHERE user_id = $1;`,
        [ user_id, pointsToAdd ]
      );
      logger.info(`[LearningService] Added ${pointsToAdd} points for user ${user_id}`);
    }
  }

  await pool.query(
    `UPDATE user_points
    SET tier_status = CASE
      WHEN total_points >= 200 THEN 'diamond'
      WHEN total_points >= 150 THEN 'platinum'
      WHEN total_points >= 100 THEN 'gold'
      WHEN total_points >= 60 THEN 'silver'
      WHEN total_points >= 30 THEN 'bronze'
      ELSE 'wood'
    END
    WHERE user_id = $1;`,
    [user_id]
  );

  const result = await pool.query(attemptQuery, [user_id, quiz_id, attempt_score, passed]);
  if (!result?.rows?.[0]) {  // More comprehensive check
    logger.error(`[LearningService] Failed to submit quiz attempt for user ${user_id} on quiz ${quiz_id}`);
    throw new Error('Failed to submit quiz attempt');
  }
  return result.rows[0];
}

// 📈 Get all quiz attempts by user
export async function getUserQuizAttempts(user_id: number) {
  const query = `
    SELECT * FROM quiz_attempts
    WHERE user_id = $1
    ORDER BY timestamp DESC
  `;
  const result = await pool.query(query, [ user_id ]);
  return result.rows;
}

// 🧠 Get quiz attempts for a user and quiz
export async function getUserQuizAttemptsForQuiz(user_id: number, quiz_id: number) {
  const query = `
    SELECT * FROM quiz_attempts
    WHERE user_id = $1 AND quiz_id = $2
    ORDER BY attempt_number DESC
  `;
  const result = await pool.query(query, [ user_id, quiz_id ]);
  return result.rows;
}


export async function getLearningPerformance(user_id: number) {
 const query = `
    SELECT
      SUM(CASE WHEN passed THEN 1 ELSE 0 END) AS total_passed,
      COUNT(*) AS total_attempts,
      AVG(attempt_score) AS average_score
    FROM quiz_attempts
    WHERE user_id = $1;
  `;
  const accuracy = await pool.query(query, [user_id]);

  const pointsQuery = `
    SELECT total_points
    FROM user_points
    WHERE user_id = $1;
  `;
  const pointsResult = await pool.query(pointsQuery, [user_id]);

  const totalPoints = pointsResult.rows[0]?.total_points || 0;

  // Stubbed view count for now
  const viewCount = 1;

  const averageScore = parseFloat(accuracy.rows[0].average_score) || 0;
  const total_attempts = parseInt(accuracy.rows[0].total_attempts) || 0;
  const total_passed = parseInt(accuracy.rows[0].total_passed) || 0;
  const score = averageScore * 0.5 + totalPoints * 0.5 + viewCount * 0.1 + total_attempts * 0.4 + total_passed * 0.7;

  const scaledScore = Math.round(
    (score / 206) * (850 - 300) + 300
  );

  return scaledScore;
}

export async function getLearningSummary(user_id: number) {
  const performance = await getLearningPerformance(user_id);
  // The credit score is scaled between 300 and 850, so get percentage relative to this range
  const minScore = 300;
  const maxScore = 850;
  const normalized = (performance - minScore) / (maxScore - minScore); // 0 to 1
  // Calculate total points earned from quizzes alone
  const quizPointsQuery = `
    SELECT COALESCE(SUM(CASE WHEN passed THEN 10 ELSE 0 END), 0) AS quiz_points
    FROM quiz_attempts
    WHERE user_id = $1
  `;
  const quizPointsResult = await pool.query(quizPointsQuery, [user_id]);
  const quizPoints = parseInt(quizPointsResult.rows[0].quiz_points) || 0;

  const quizAttemptsQuery = `
    SELECT COUNT(*) AS total_attempts
    FROM quiz_attempts
    WHERE user_id = $1;
  `;
  const quizAttemptsResult = await pool.query(quizAttemptsQuery, [user_id]);

  const quizAttemptsLeftQuery = `
    SELECT COUNT(*) AS total_left
    FROM quizzes q
    LEFT JOIN quiz_attempts qa 
      ON q.quiz_id = qa.quiz_id AND qa.user_id = $1 AND qa.passed = true
    WHERE qa.quiz_id IS NULL;
  `;
  const quizAttemptsLeftResult = await pool.query(quizAttemptsLeftQuery, [user_id]);

  // get total modules
  const modulesQuery = `
    SELECT COUNT(*) AS total_modules
    FROM learning_modules;
  `;

  const modulesResult = await pool.query(modulesQuery);
  const totalModules = modulesResult.rows[0] ? parseInt(modulesResult.rows[0].total_modules) : 0;
  
  // get percent of quizzes completed
  const completedQuizzesQuery = `
    SELECT COUNT(DISTINCT quiz_id) AS completed_quizzes
    FROM quiz_attempts
    WHERE user_id = $1 AND passed = true;
  `;

  const completedQuizzesResult = await pool.query(completedQuizzesQuery, [user_id]);
  const completedQuizzes = parseInt(completedQuizzesResult.rows[0].completed_quizzes) || 0;
  const percentCompleted = totalModules > 0 ? (completedQuizzes / totalModules) * 100 : 0;

  const summary = {
    modules: totalModules,
    points: quizPoints,
    total_attempts: parseInt(quizAttemptsResult.rows[0].total_attempts) || 0,
    total_quizzes_left: parseInt(quizAttemptsLeftResult.rows[0].total_left) || 0,
    total_views: 1, // stubbed
    score: performance,
    percent: percentCompleted.toFixed(2)
  };

  return summary;
}

