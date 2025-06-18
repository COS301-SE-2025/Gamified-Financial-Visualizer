// learning.service.ts
import pool from "../../../config/db";
import { logger } from "../../../config/logger";

// 🧠 Get all learning modules
export async function getAllModules() {
  const query = `SELECT * FROM learning_modules ORDER BY module_id ASC`;
  const result = await pool.query(query);
  return result.rows;
}

// 📘 Get a specific module by ID
export async function getModuleById(module_id: number) {
  const query = `SELECT * FROM learning_modules WHERE module_id = $1`;
  const result = await pool.query(query, [module_id]);
  return result.rows[0];
}

// 📚 Get all lessons under a specific module
export async function getLessonsByModule(module_id: number) {
  const query = `
    SELECT * FROM lessons
    WHERE module_id = $1
    ORDER BY lesson_number ASC
  `;
  const result = await pool.query(query, [module_id]);
  return result.rows;
}

// 📖 Get a specific lesson by ID
export async function getLessonById(lesson_id: number) {
  const query = `SELECT * FROM lessons WHERE lesson_id = $1`;
  const result = await pool.query(query, [lesson_id]);
  return result.rows[0];
}

// 📝 Get quiz for a specific module
export async function getQuizByModuleId(module_id: number) {
  const query = `
    SELECT * FROM quizzes
    WHERE module_id = $1
  `;
  const result = await pool.query(query, [module_id]);
  return result.rows;
}

// 🧪 Get specific quiz by ID
export async function getQuizById(quiz_id: number) {
  const query = `SELECT * FROM quizzes WHERE quiz_id = $1`;
  const result = await pool.query(query, [quiz_id]);
  return result.rows[0];
}

// 🧾 Submit a quiz attempt
export async function submitQuizAttempt(
  user_id: number,
  quiz_id: number,
  attempt_score: number,
  passed: boolean
) {
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
  const result = await pool.query(attemptQuery, [user_id, quiz_id, attempt_score, passed]);
  logger.info(`[LearningService] Submitted quiz attempt for user ${user_id}, quiz ${quiz_id}`);
  return result.rows[0];
}

// 📈 Get all quiz attempts by user
export async function getUserQuizAttempts(user_id: number) {
  const query = `
    SELECT * FROM quiz_attempts
    WHERE user_id = $1
    ORDER BY timestamp DESC
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

// 🧠 Get quiz attempts for a user and quiz
export async function getUserQuizAttemptsForQuiz(user_id: number, quiz_id: number) {
  const query = `
    SELECT * FROM quiz_attempts
    WHERE user_id = $1 AND quiz_id = $2
    ORDER BY attempt_number DESC
  `;
  const result = await pool.query(query, [user_id, quiz_id]);
  return result.rows;
}
