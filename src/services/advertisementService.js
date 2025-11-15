/**
 * Advertisement Service
 * Centralized service for managing advertisement content and modal state.
 * 
 * This service is designed to be easily removable - simply delete this file
 * and remove the integration code from LessonView.jsx
 */

// Advertisement content constants
const CLASS_INFO = {
  course: 'Web Frameworks CIT 84',
  semester: 'Spring 2026',
  prerequisite: 'CIT 93',
  prerequisiteNote: 'CIT 93 is a requirement (you can always take 93 first)',
}

export const ADVERTISEMENT_CONTENT = {
  classInfo: CLASS_INFO,
}

// Helper function to get step 1 modal content
export const getStep1ModalContent = () => ({
  title: 'Great job completing the first step!',
  personalIntro: 'Hi I\'m Rick Gomez, a professor at Fresno City College in the BE department. I have been a software engineer for over 9+ years. I built this application out with the Breanna (you might know her). This is a preview of what\'s to come in CIT 84 class.',
  courseInfo: `${CLASS_INFO.course} in ${CLASS_INFO.semester}`,
  prerequisiteCourse: 'CIT 93 (Javascript)',
  prerequisiteLabel: 'Prerequisite:',
  callToAction: 'Sign up for classes today',
  enrollmentInfo: 'Go to self service to enroll now',
  buttonText: 'Continue with the challenge',
  profileImage: '/assets/instructor-profile.png', // Image in public/assets/instructor-profile.png
})

// Helper function to get completion modal content
export const getCompletionModalContent = () => ({
  title: 'Congratulations!',
  message: `You've completed all steps! I'm teaching ${CLASS_INFO.course} in ${CLASS_INFO.semester}. ${CLASS_INFO.prerequisiteNote}.`,
  badgeText: '🎉 All Steps Complete!',
})

