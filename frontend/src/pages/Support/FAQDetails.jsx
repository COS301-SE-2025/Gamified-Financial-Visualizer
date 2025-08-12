import React, { useState } from 'react';
import { FaPlus, FaMinus, FaCheckCircle, FaMedal, FaStar, FaFire, FaTrophy, FaPenNib } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = {
  'Goal Quests': [
    'How to create a goal',
    'Fixed deadlines',
    'Track goal progress visually',
    'Delete a goal',
    'Set automatic contributions',
    'View rewards per goal'
  ],
  'Community Adventures': [
    'How to join or leave a community',
    'View members and roles',
    'Join group quests',
    'Compete on leaderboards',
    'Showcase your achievements'
  ],
  'Accounts & Transactions': [
    'How to add a transaction',
    'Edit or delete entries',
    'Auto-categorize expenses',
    'Connect your bank accounts',
    'Track monthly budgets',
    'Use insights and trends'
  ],
  'Achievements': [
    'Unlocking new badges',
    'Track milestone progression',
    'Understand badge rarity',
    'Collect full categories',
    'See your XP analytics'
  ],
  "Fainancial Literacy": [
    'Start an interactive lesson',
    'Take and retake quizzes',
    'View your learning path',
    'Earn XP by completing tracks',
    'Track lesson history'
  ],
  'Your Profile': [
    'Customize your avatar',
    'Track personal progress',
    'View XP breakdown',
    'Manage login and security',
    'View timeline of your journey'
  ],
  'AR World': [
    'What is the AR mode?',
    'Activate financial AR dashboard',
    'Switch between AR and classic views',
    'Use gestures in AR mode',
    'Interpret 3D visuals'
  ]
};

const XpPopup = ({ amount }) => (
  <motion.div
    className="absolute top-0 right-0 bg-yellow-400 dark:bg-yellow-500 text-yellow-800 dark:text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md"
    initial={{ y: -20, opacity: 0, scale: 0.5 }}
    animate={{ y: -40, opacity: 1, scale: 1 }}
    exit={{ y: -60, opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    +{amount} XP
  </motion.div>
);

const FAQDetails = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [unlocked, setUnlocked] = useState({});
  const [xpEarned, setXpEarned] = useState({});
  const [showXpToast, setShowXpToast] = useState(null);
  const [masteredCategories, setMasteredCategories] = useState([]);

  const toggle = (index, category) => {
    setOpenIndex(openIndex === index ? null : index);

    if (!unlocked[index]) {
      setUnlocked(prev => ({ ...prev, [index]: true }));
      const xpAmount = 10 + Math.floor(Math.random() * 5);
      setXpEarned(prev => ({ ...prev, [category]: (prev[category] || 0) + xpAmount }));
      setShowXpToast(index);
      setTimeout(() => setShowXpToast(null), 1500);

      const categoryItems = faqData[category];
      const unlockedCount = categoryItems.filter((_, i) => unlocked[`${category}-${i}`]).length + 1;

      if (unlockedCount === categoryItems.length && !masteredCategories.includes(category)) {
        setMasteredCategories(prev => [...prev, category]);
      }
    }
  };

  // Helper function to get the actual content for each FAQ item
  const getFAQContent = (question, category) => {
    const contentMap = {
      'Goal Quests': {
        'How to create a goal': (
          <>
            <p className="mb-2 dark:text-gray-300">To create a new savings goal:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Navigate to the <strong>Goals</strong> page from the sidebar</li>
              <li>Click the <strong>“Create Goal”</strong> button</li>
              <li>Fill in your goal name, target amount, goal category and deadline</li>
              <li>Choose a banner image to visually represent your goal</li>
              <li>Click <strong>“Save Goal”</strong> to finish</li>
            </ol>
            <p className="dark:text-gray-300">The goal will be displayed as a card with a visual progress bar and due date.</p>
          </>
        ),
        'Fixed deadlines': (
          <>
            <p className="mb-2 dark:text-gray-300">Deadlines in the Goal system are not fully adjustable. You cannot:</p>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>Edit your deadline at any time by opening the goal and selecting a new date</li>
              <li>Extend overdue goals as this will casue you to lose progress</li>
              <li>Break down large goals into <em>sub-deadlines</em></li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Making your deadline fixed encourages better savings and goal tracking habits.</p>
          </>
        ),
        'Track goal progress visually': (
          <>
            <p className="dark:text-gray-300">Each goal card includes a live progress bar and color-coded visuals:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li><strong>Donut chart</strong> shows percentage of target amount saved</li>
              <li><strong>Bar chart</strong> compares goal progress across all goals every week</li>
              <li><strong>Deadline badges</strong> highlight urgency fro upcoming goal deadlines</li>
            </ul>
            <p className="dark:text-gray-300">You can also view detailed stats by clicking on the view more button under a goal.</p>
          </>
        ),
        'Delete a goal': (
          <>
            <p className="mb-2 dark:text-gray-300"><strong>To delete a goal:</strong></p>
            <ol className="list-decimal pl-5 space-y-1 dark:text-gray-300">
              <li>Click the three-dot menu on the goal card</li>
              <li>Select <strong>“Delete”</strong></li>
              <li>Confirm the deletion (this is permanent)</li>
            </ol>
          </>
        ),
        'Set automatic contributions': (
          <>
            <p className="dark:text-gray-300">While automatic financial contributions are not yet live, upcoming features will support:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Recurring savings deductions from linked accounts</li>
              <li>Custom contribution schedules (daily, weekly, monthly)</li>
              <li>Progress automation based on task completion (for non-financial goals)</li>
            </ul>
            <p className="dark:text-gray-300">You can currently update the <strong>“current amount”</strong> manually from the goal detail view.</p>
          </>
        ),
        'View rewards per goal': (
          <>
            <p className="dark:text-gray-300">Every goal can reward you with the following:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded">
                <p className="font-bold text-yellow-500 dark:text-yellow-400">XP Points</p>
                <p className="dark:text-gray-300">Earned based on progress and completion</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 p-2 rounded">
                <p className="font-bold text-[#5FBFFF] dark:text-cyan-400">Badges</p>
                <p className="dark:text-gray-300">Each goal type unlocks unique badges</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded">
                <p className="font-bold text-orange-500 dark:text-orange-400">Leaderboard Points</p>
                <p className="dark:text-gray-300">Rank up in the Community by completing goals</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded">
                <p className="font-bold text-purple-400 dark:text-purple-300">Combo Bonuses</p>
                <p className="dark:text-gray-300">Complete similar goals in a series for XP multipliers</p>
              </div>
            </div>
            <p className="mt-2 dark:text-gray-300">Rewards are shown when you mark a goal as complete.</p>
          </>
        )
      },

      'Community Adventures': {
        'How to join or leave a community': (
          <>
            <p className="mb-2 dark:text-gray-300">To join a community:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Navigate to the <strong>Community</strong> section via the sidebar.</li>
              <li>Browse available guilds on the community list page.</li>
              <li>Tap the <strong>"Join"</strong> button on one that interests you.</li>
            </ol>
            <p className="mt-2 dark:text-gray-300">To leave a community:</p>
            <ol className="list-decimal pl-5 space-y-1 dark:text-gray-300">
              <li>Open the community's dashboard.</li>
              <li>Click the <strong>“Options”</strong> or <strong>“Settings”</strong> menu.</li>
              <li>Select <strong>"Leave Guild"</strong> and confirm your exit.</li>
            </ol>
          </>
        ),
        'View members and roles': (
          <>
            <p className="dark:text-gray-300">You can view and interact with community members using the <strong>Community Dashboard</strong>:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Navigate to the desired community's detail page.</li>
              <li>Select the <strong>“Members”</strong> tab or scroll down to view avatars and names.</li>
              <li>Each member's XP level and role (e.g., Leader, Member) are indicated.</li>
              <li>Click a member to view their stats, badges, and profile highlights.</li>
            </ul>
          </>
        ),
        'Join group quests': (
          <>
            <p className="dark:text-gray-300">Communities unlock powerful XP boosts through group challenges:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Inside your community dashboard, tap <strong>“Game Room”</strong>.</li>
              <li>Choose from available collaborative quests (seasonal or ongoing).</li>
              <li>Contribute by completing assigned tasks — tracked as group progress bars.</li>
              <li>Earn shared XP, boost guild rankings, and unlock exclusive badges.</li>
            </ul>
          </>
        ),
        'Compete on leaderboards': (
          <>
            <p className="dark:text-gray-300">Guild performance is tracked through <strong>global leaderboards</strong>:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Access the <strong>Leaderboard</strong> tab from the Community Dashboard.</li>
              <li>Ranks are based on:</li>
              <ul className="list-disc pl-8 space-y-1 dark:text-gray-300">
                <li>Total XP earned this week</li>
                <li>Goals completed collectively</li>
                <li>Quests contributed to</li>
              </ul>
              <li>Higher rank communities unlock prestige rewards and visibility.</li>
            </ul>
          </>
        ),
        'Showcase your achievements': (
          <>
            <p className="dark:text-gray-300">Let your legend shine within your guild:</p>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>Your <strong>top badges and longest streaks</strong> are highlighted on your community profile.</li>
              <li>Achievements earned in <strong>group quests</strong> glow with rarity effects.</li>
              <li>Friends can view your full performance stats by visiting your <strong>member page</strong>.</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Navigate to your avatar from the members list to see how others view your journey.</p>
          </>
        )
      },

      'Accounts Vault': {
        'How to add a transaction': (
          <>
            <p className="mb-2 dark:text-gray-300">To add a new transaction manually:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Navigate to the "Transactions" page.</li>
              <li>Tap the <strong>“+ Add”</strong> button on the top right.</li>
              <li>Enter the transaction name, amount, and select a category.</li>
              <li>Optionally add a note or change the date.</li>
              <li>Click "Save" to record it.</li>
            </ol>
            <p className="dark:text-gray-300">Manual entries are helpful for cash expenses or uncategorized purchases.</p>
          </>
        ),
        'Edit or delete entries': (
          <>
            <p className="mb-2 dark:text-gray-300">To modify or remove a transaction:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Locate the transaction in the table.</li>
              <li>Click the <strong>Edit</strong> or <strong>Delete</strong> icon on the right.</li>
              <li>For edits, update the fields and click "Save".</li>
              <li>For deletion, confirm the prompt to remove it permanently.</li>
            </ul>
          </>
        ),
        'Auto-categorize expenses': (
          <>
            <p className="dark:text-gray-300">Our system uses smart AI tagging to automatically group expenses into:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Groceries, Dining, Transport, Bills, and more</li>
              <li>Recurring transactions like subscriptions or rent</li>
              <li>Spending trends based on description and frequency</li>
            </ul>
            <p className="dark:text-gray-300">You can override categories manually by clicking "Edit" on a transaction and selecting a new category.</p>
          </>
        ),
        'Connect your bank accounts': (
          <>
            <p className="dark:text-gray-300">To streamline your transactions:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Go to the "Import" section under Accounts.</li>
              <li>Select your bank from the list or upload a CSV/OFX statement.</li>
              <li>Authorize connection or map the columns during file upload.</li>
              <li>Transactions will be auto-imported into your vault.</li>
            </ol>
            <p className="mt-2 dark:text-gray-300">Security: We use end-to-end encryption and bank-grade security for all financial integrations.</p>
          </>
        ),
        'Track monthly budgets': (
          <>
            <p className="dark:text-gray-300">Use the "Budget" tab to plan and stay on track:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Set a monthly or category-based limit (e.g., R2000 for Dining)</li>
              <li>Track progress with visual bars that fill as you spend</li>
              <li>Receive alerts when approaching or exceeding budget</li>
            </ul>
            <p className="dark:text-gray-300">Budgets reset monthly and influence your XP bonuses.</p>
          </>
        ),
        'Use insights and trends': (
          <>
            <p className="dark:text-gray-300">Navigate to "Insights" for detailed AI-driven suggestions:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Compare your spending to users your age or income level</li>
              <li>See category breakdowns and over/under spending</li>
              <li>Ask the built-in AI advisor for savings or investment suggestions</li>
            </ul>
            <p className="dark:text-gray-300">Insights are updated weekly based on your activity.</p>
          </>
        )
      },

      'Trophy Room': {
        'Unlocking new badges': (
          <>
            <p className="mb-2 dark:text-gray-300">Badges are earned by completing achievements tied to your activity:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Complete goals and quests</li>
              <li>Reach XP milestones</li>
              <li>Participate in community challenges</li>
              <li>Engage in learning modules and quizzes</li>
            </ul>
            <p className="dark:text-gray-300">You'll receive a badge popup with animation and confetti when you unlock one.</p>
          </>
        ),
        'Track milestone progression': (
          <>
            <p className="mb-2 dark:text-gray-300">Each badge has a progress bar and milestones:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Open the <strong>Achievements</strong> tab</li>
              <li>Click on any badge to view details</li>
              <li>Check how far you are from completing it</li>
            </ol>
            <p className="dark:text-gray-300">Progress is based on repeated completion (e.g., save goals, join quests, complete quizzes).</p>
          </>
        ),
        'Understand badge rarity': (
          <>
            <p className="dark:text-gray-300">Badges come in tiers:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li><span className="font-bold text-yellow-500 dark:text-yellow-400">Common:</span> For basic actions (e.g., first goal)</li>
              <li><span className="font-bold text-cyan-400 dark:text-cyan-300">Rare:</span> Requires moderate commitment (e.g., daily streak)</li>
              <li><span className="font-bold text-orange-500 dark:text-orange-400">Legendary:</span> Only few earn these through group events or high XP</li>
            </ul>
            <p className="dark:text-gray-300">Hover over any badge to see its rarity and how to earn it.</p>
          </>
        ),
        'Collect full categories': (
          <>
            <p className="dark:text-gray-300">Badges are grouped into themes:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Goal Completion</li>
              <li>Community Engagement</li>
              <li>Learning Milestones</li>
              <li>Financial Achievements</li>
            </ul>
            <p className="dark:text-gray-300">Completing all badges in a group unlocks a Master Badge with bonus XP and glow effects.</p>
          </>
        ),
        'See your XP analytics': (
          <>
            <p className="dark:text-gray-300">Your XP is visualized in charts and timelines:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Track how and where you earned XP</li>
              <li>View daily, weekly, and monthly trends</li>
              <li>Spot dips in activity to improve consistency</li>
            </ul>
            <p className="dark:text-gray-300">Visit your profile → XP Analytics to get a full breakdown of your journey.</p>
          </>
        )
      },

      'Knowledge Path': {
        'Start an interactive lesson': (
          <>
            <p className="mb-2 dark:text-gray-300">To begin a lesson:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Navigate to the Learn tab in the app.</li>
              <li>Select a course such as Budget, Savings, or Investment.</li>
              <li>Tap on a lesson to expand and view its content.</li>
              <li>Read through the content and scroll to access examples, visuals, or action items.</li>
            </ol>
            <p className="dark:text-gray-300">Lessons unlock progressively. Completed lessons are marked with a green check.</p>
          </>
        ),
        'Take and retake quizzes': (
          <>
            <p className="mb-2 dark:text-gray-300">Each module ends with a quiz to reinforce learning:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Tap the quiz at the end of the module (marked with a trophy icon).</li>
              <li>Answer all multiple-choice questions to activate the "Submit" button.</li>
              <li>Receive instant feedback and score once submitted.</li>
              <li>Missed some? Tap "Try Again" to retake for a better score (XP only awarded once).</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Perfect scores unlock a bonus XP reward.</p>
          </>
        ),
        'View your learning path': (
          <>
            <p className="dark:text-gray-300">The Learning Path tracks your progress across topics:</p>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>Each course card shows progress % and number of lessons completed.</li>
              <li>Tap a course to see individual lesson completion indicators.</li>
              <li>Modules include introductory theory, visual examples, and quizzes.</li>
            </ul>
          </>
        ),
        'Earn XP by completing tracks': (
          <>
            <p className="dark:text-gray-300">XP is awarded for learning actions:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded">
                <p className="font-bold text-amber-500 dark:text-amber-400">+10 XP</p>
                <p className="dark:text-gray-300">For each completed lesson</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 p-2 rounded">
                <p className="font-bold text-cyan-500 dark:text-cyan-400">+5 XP Bonus</p>
                <p className="dark:text-gray-300">For perfect quiz scores</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded">
                <p className="font-bold text-orange-500 dark:text-orange-400">+50 XP</p>
                <p className="dark:text-gray-300">When finishing an entire track</p>
              </div>
            </div>
            <p className="mt-2 dark:text-gray-300">Check your XP under your profile in the Character Sheet.</p>
          </>
        ),
        'Track lesson history': (
          <>
            <p className="dark:text-gray-300">To review lessons you've completed:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 dark:text-gray-300">
              <li>Open a course and scroll to previously unlocked lessons.</li>
              <li>Completed lessons are marked with green check icons.</li>
              <li>You can re-read lessons anytime. Retaking a quiz will not grant XP again unless improved.</li>
            </ul>
            <p className="dark:text-gray-300">Your learning history also contributes to your lifetime XP and badge unlocks.</p>
          </>
        )
      },

      'Character Profile': {
        'Customize your avatar': (
          <>
            <p className="dark:text-gray-300">You can change your avatar to match your personality or achievements:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 mt-2 dark:text-gray-300">
              <li>Go to your Profile</li>
              <li>Select the "Change Avatar" section</li>
              <li>Choose from a list of available avatars</li>
              <li>Tap the one you want and it will be saved automatically</li>
            </ol>
            <p className="dark:text-gray-300">Selected avatars will be visible in all sections where your user icon is shown.</p>
          </>
        ),
        'Track personal progress': (
          <>
            <p className="dark:text-gray-300">Track your journey across all modules:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>XP earned per module</li>
              <li>Number of goals completed</li>
              <li>Lessons finished and quizzes passed</li>
              <li>Badges and milestones earned</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Find this data under your profile timeline and analytics section.</p>
          </>
        ),
        'View XP breakdown': (
          <>
            <p className="dark:text-gray-300">Your XP history is broken down by activity type:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>XP from goals (Quest Log)</li>
              <li>XP from transactions (Coin Vault)</li>
              <li>XP from learning (Savers Library)</li>
              <li>XP from community activity (Guild)</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Each section clearly lists how much XP you earned and when.</p>
          </>
        ),
        'Manage login and security': (
          <>
            <p className="dark:text-gray-300">In the <strong>Settings</strong> tab of your Profile, you can:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>Change your username</li>
              <li>Reset your password</li>
              <li>Enable two-factor verification</li>
              <li>Adjust theme and notification preferences</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Security changes take effect immediately and can be confirmed via email if required.</p>
          </>
        ),
        'View timeline of your journey': (
          <>
            <p className="dark:text-gray-300">Your journey timeline is a visual history of your activities:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>Major milestones like goal completions or XP streaks</li>
              <li>New badge unlocks and level-ups</li>
              <li>Join dates for communities or quests</li>
            </ul>
            <p className="mt-2 dark:text-gray-300">Find this timeline under the "Journey" section of your profile.</p>
          </>
        )
      },

      'AR World': {
        'What is the AR mode?': (
          <>
            <p className="dark:text-gray-300">The AR mode transforms your financial data into a 3D augmented reality environment.</p>
            <p className="mt-2 dark:text-gray-300">You can explore your dashboard as a virtual control center, where each financial module is visualized as an interactive object or area.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>Goals are mountains with flags showing progress</li>
              <li>Transactions flow like animated coin streams</li>
              <li>Achievements appear as glowing trophy pedestals</li>
            </ul>
          </>
        ),
        'Activate financial AR dashboard': (
          <>
            <p className="dark:text-gray-300">To enter AR mode:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2 mt-2 dark:text-gray-300">
              <li>Go to the Dashboard section</li>
              <li>Tap the "Enter AR Mode" button in the top right corner</li>
              <li>Grant camera access if prompted</li>
              <li>Scan a flat surface to place your AR hub</li>
            </ol>
            <p className="dark:text-gray-300">The hub will appear anchored to the surface and display your financial data interactively.</p>
          </>
        ),
        'Switch between AR and classic views': (
          <>
            <p className="dark:text-gray-300">You can easily switch between modes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li>In AR mode, tap the "Exit AR" button on the control panel</li>
              <li>In classic mode, tap the AR toggle icon to re-enter AR</li>
            </ul>
            <p className="dark:text-gray-300">Progress is synced across both views in real-time.</p>
          </>
        ),
        'Use gestures in AR mode': (
          <>
            <p className="dark:text-gray-300">Control your experience using intuitive gestures:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 dark:text-gray-300">
              <li><strong>Pinch</strong> to zoom into goals or transactions</li>
              <li><strong>Drag</strong> to reposition the dashboard in space</li>
              <li><strong>Tap</strong> on buildings or objects to view detailed stats</li>
              <li><strong>Swipe</strong> between goal cards or achievement stacks</li>
            </ul>
          </>
        ),
        'Interpret 3D visuals': (
          <>
            <p className="dark:text-gray-300">Each visual element in AR mode has meaning:</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded">
                <p className="font-bold text-cyan-500 dark:text-cyan-400">Bars</p>
                <p className="dark:text-gray-300">Represent budgets, progress, or XP</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded">
                <p className="font-bold text-yellow-500 dark:text-yellow-400">Coins</p>
                <p className="dark:text-gray-300">Reflect spending and transaction flow</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded">
                <p className="font-bold text-orange-500 dark:text-orange-400">Flags</p>
                <p className="dark:text-gray-300">Mark goal milestones and deadlines</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded">
                <p className="font-bold text-purple-400 dark:text-purple-300">Trophies</p>
                <p className="dark:text-gray-300">Indicate unlocked achievements</p>
              </div>
            </div>
            <p className="mt-2 dark:text-gray-300">Tap any visual in AR for real-time details and interactions.</p>
          </>
        )
      }

    };

    return contentMap[category]?.[question] || null;
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 dark:bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#88BC46] dark:text-lime-400 mb-2">Knowledge Vault</h1>
        <p className="text-lg text-[#858584] dark:text-gray-400">Unlock answers and earn rewards!</p>
      </div>

      <div className="bg-gradient-to-r from-[#88BC46] to-[#98C988] dark:from-lime-600 dark:to-lime-700 rounded-xl p-4 shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaFire className="text-orange-300 text-xl" />
            <div>
              <p className="text-xs text-white">Current Streak</p>
              <p className="font-bold">5 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-300 text-xl" />
            <div>
              <p className="text-xs text-white">Total XP Earned</p>
              <p className="font-bold">245 XP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-400 text-xl" />
            <div>
              <p className="text-xs text-white">Categories Mastered</p>
              <p className="font-bold">{masteredCategories.length}/{Object.keys(faqData).length}</p>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(faqData).map(([category, items]) => {
        const total = items.length;
        const unlockedCount = items.filter((_, i) => unlocked[`${category}-${i}`]).length;
        const complete = masteredCategories.includes(category);
        const progress = (unlockedCount / total) * 100;

        return (
          <motion.div
            key={category}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-lime-100 dark:border-gray-700 overflow-hidden"
          >
            <div className={`p-4 ${complete ? 'bg-gradient-to-r from-yellow-100 dark:from-yellow-900/30 to-yellow-50 dark:to-yellow-800/20' : 'bg-gradient-to-r from-lime-50 dark:from-gray-700 to-lime-50 dark:to-gray-700'}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-lime-700 dark:text-lime-400 flex items-center gap-2">
                  {complete && <FaMedal className="text-yellow-500 dark:text-yellow-400" />} {category}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${complete ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : 'bg-lime-200 dark:bg-lime-900/30 text-lime-800 dark:text-lime-200'}`}>{unlockedCount}/{total} unlocked</span>
                  {complete && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaCheckCircle /> Mastered
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className={`h-full ${complete ? 'bg-gradient-to-r from-yellow-300 dark:from-yellow-500 to-orange-300 dark:to-orange-400' : 'bg-gradient-to-r from-blue-400 dark:from-blue-500 to-cyan-200 dark:to-cyan-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className="divide-y divide-indigo-50/50 dark:divide-gray-700">
              {items.map((text, i) => {
                const index = `${category}-${i}`;
                const isOpen = openIndex === index;
                const isUnlocked = unlocked[index];

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => toggle(index, category)}
                    className={`p-4 cursor-pointer transition-all ${isUnlocked ? 'bg-green-50/50 dark:bg-green-900/10' : 'hover:bg-indigo-50/30 dark:hover:bg-gray-700/50'}`}
                  >
                    <div className="relative">
                      <AnimatePresence>
                        {showXpToast === index && <XpPopup amount={xpEarned[category] - (xpEarned[category] - 10)} />}
                      </AnimatePresence>

                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${isUnlocked ? 'text-lime-700 dark:text-lime-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {isUnlocked && <FaCheckCircle className="inline mr-2 text-lime-500 dark:text-lime-400" />} {text}
                        </h3>
                        <div className={`text-lg ${isUnlocked ? 'text-[#6BA226] dark:text-lime-400' : 'text-red-500 dark:text-red-400'}`}>{isOpen ? <FaMinus /> : <FaPlus />}</div>
                      </div>

                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-indigo-100/50 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                            {getFAQContent(text, category)}
                            {!isUnlocked && (
                              <p className="text-xs text-[#FFBF1A] dark:text-yellow-400 mt-2">
                                <FaStar className="inline mr-1" /> Unlock to earn XP!
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {masteredCategories.length > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-100 dark:from-yellow-900/30 to-yellow-50 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-500 dark:text-yellow-400 text-2xl" />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Mastered Categories</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">You've completed: {masteredCategories.join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FAQDetails;