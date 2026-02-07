/**
 * Smart Chatbot Questions Generator
 * Generates different questions based on resume category
 */

// Common questions (for all categories)
export const commonQuestions = [
  {
    id: 'notice_period',
    question: 'What is your notice period?',
    questionEn: 'What is your notice period?',
    options: [
      { value: 'Immediate', label: 'Immediately' },
      { value: '15 days', label: '15 days' },
      { value: '1 month', label: '1 month' },
      { value: '2 months', label: '2 months' }
    ],
    field: 'noticePeriod'
  },
  {
    id: 'work_mode',
    question: 'What is your preferred work mode?',
    questionEn: 'What is your preferred work mode?',
    options: [
      { value: 'Office', label: 'Work from Office' },
      { value: 'Hybrid', label: 'Hybrid (Office + Home)' },
      { value: 'Remote', label: 'Fully Remote' }
    ],
    field: 'workMode'
  },
  {
    id: 'willing_relocate',
    question: 'Are you willing to relocate?',
    questionEn: 'Are you willing to relocate?',
    options: [
      { value: 'yes', label: 'Yes, to any location' },
      { value: 'metro', label: 'Only metro cities' },
      { value: 'no', label: 'No, only my current city' }
    ],
    field: 'willingToRelocate'
  }
];

// Technical category questions
export const technicalQuestions = [
  {
    id: 'tech_job_type',
    question: 'What type of technical role are you looking for?',
    questionEn: 'What type of technical role are you looking for?',
    options: [
      { value: 'Full-time', label: 'Full-time' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract Based' },
      { value: 'Remote', label: 'Remote Only' }
    ],
    field: 'preferredJobType'
  },
  {
    id: 'tech_salary',
    question: 'What is your expected salary (per annum)?',
    questionEn: 'What is your expected salary (per annum)?',
    options: [
      { value: '3-5', label: '₹3-5 Lakh' },
      { value: '5-8', label: '₹5-8 Lakh' },
      { value: '8-12', label: '₹8-12 Lakh' },
      { value: '12-20', label: '₹12-20 Lakh' },
      { value: '20+', label: '₹20+ Lakh' }
    ],
    field: 'expectedSalary'
  },
  {
    id: 'tech_location',
    question: 'Which city do you prefer to work in?',
    questionEn: 'Which city do you prefer?',
    options: [
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi NCR', label: 'Delhi/NCR' },
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'Remote', label: 'Remote (anywhere)' }
    ],
    field: 'preferredLocation',
    multiple: true
  },
  {
    id: 'tech_industry',
    question: 'Which industry are you interested in?',
    questionEn: 'Which industry are you interested in?',
    options: [
      { value: 'IT Services', label: 'IT Services & Consulting' },
      { value: 'Product', label: 'Product Companies' },
      { value: 'Startup', label: 'Startups' },
      { value: 'E-commerce', label: 'E-commerce' },
      { value: 'Fintech', label: 'Fintech' },
      { value: 'Any', label: 'Any Industry' }
    ],
    field: 'preferredIndustry',
    multiple: true
  }
];

// Sales category questions
export const salesQuestions = [
  {
    id: 'sales_job_type',
    question: 'What type of sales role are you looking for?',
    questionEn: 'What type of sales role are you looking for?',
    options: [
      { value: 'Full-time', label: 'Full-time Field Sales' },
      { value: 'Remote', label: 'Inside Sales (Remote)' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract Based' }
    ],
    field: 'preferredJobType'
  },
  {
    id: 'sales_salary',
    question: 'What is your expected salary (base + incentive)?',
    questionEn: 'What is your expected salary?',
    options: [
      { value: '2-4', label: '₹2-4 Lakh' },
      { value: '4-6', label: '₹4-6 Lakh' },
      { value: '6-10', label: '₹6-10 Lakh' },
      { value: '10-15', label: '₹10-15 Lakh' },
      { value: '15+', label: '₹15+ Lakh' }
    ],
    field: 'expectedSalary'
  },
  {
    id: 'sales_location',
    question: 'Which location are you comfortable for sales?',
    questionEn: 'Which location do you prefer?',
    options: [
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi NCR', label: 'Delhi/NCR' },
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Remote', label: 'Remote Sales' }
    ],
    field: 'preferredLocation',
    multiple: true
  },
  {
    id: 'sales_type',
    question: 'What type of sales do you prefer?',
    questionEn: 'What type of sales do you prefer?',
    options: [
      { value: 'B2B', label: 'B2B Sales' },
      { value: 'B2C', label: 'B2C Sales' },
      { value: 'Enterprise', label: 'Enterprise Sales' },
      { value: 'Retail', label: 'Retail Sales' },
      { value: 'Any', label: 'Any Type' }
    ],
    field: 'preferredIndustry',
    multiple: true
  }
];

// Marketing category questions
export const marketingQuestions = [
  {
    id: 'marketing_job_type',
    question: 'What type of marketing role do you want?',
    questionEn: 'What type of marketing role do you want?',
    options: [
      { value: 'Full-time', label: 'Full-time' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Remote', label: 'Remote/Freelance' },
      { value: 'Contract', label: 'Contract Based' }
    ],
    field: 'preferredJobType'
  },
  {
    id: 'marketing_salary',
    question: 'What is your expected salary?',
    questionEn: 'What is your expected salary?',
    options: [
      { value: '3-5', label: '₹3-5 Lakh' },
      { value: '5-8', label: '₹5-8 Lakh' },
      { value: '8-12', label: '₹8-12 Lakh' },
      { value: '12-18', label: '₹12-18 Lakh' },
      { value: '18+', label: '₹18+ Lakh' }
    ],
    field: 'expectedSalary'
  },
  {
    id: 'marketing_location',
    question: 'Which city do you prefer to work in?',
    questionEn: 'Which city do you prefer?',
    options: [
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi NCR', label: 'Delhi/NCR' },
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'Remote', label: 'Remote' }
    ],
    field: 'preferredLocation',
    multiple: true
  },
  {
    id: 'marketing_specialty',
    question: 'What is your marketing specialty?',
    questionEn: 'What is your marketing specialty?',
    options: [
      { value: 'Digital Marketing', label: 'Digital Marketing' },
      { value: 'Social Media', label: 'Social Media Marketing' },
      { value: 'Content Marketing', label: 'Content Marketing' },
      { value: 'SEO/SEM', label: 'SEO/SEM' },
      { value: 'Brand Management', label: 'Brand Management' },
      { value: 'Any', label: 'Any Marketing Role' }
    ],
    field: 'preferredIndustry',
    multiple: true
  }
];

// Finance category questions
export const financeQuestions = [
  {
    id: 'finance_job_type',
    question: 'What type of finance role are you looking for?',
    questionEn: 'What type of finance role are you looking for?',
    options: [
      { value: 'Full-time', label: 'Full-time' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract/Consultant' },
      { value: 'Remote', label: 'Remote' }
    ],
    field: 'preferredJobType'
  },
  {
    id: 'finance_salary',
    question: 'What is your expected salary?',
    questionEn: 'What is your expected salary?',
    options: [
      { value: '3-5', label: '₹3-5 Lakh' },
      { value: '5-8', label: '₹5-8 Lakh' },
      { value: '8-12', label: '₹8-12 Lakh' },
      { value: '12-18', label: '₹12-18 Lakh' },
      { value: '18+', label: '₹18+ Lakh' }
    ],
    field: 'expectedSalary'
  },
  {
    id: 'finance_location',
    question: 'Which city do you prefer?',
    questionEn: 'Which city do you prefer?',
    options: [
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi NCR', label: 'Delhi/NCR' },
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Chennai', label: 'Chennai' },
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'Any', label: 'Any Location' }
    ],
    field: 'preferredLocation',
    multiple: true
  },
  {
    id: 'finance_specialty',
    question: 'What is your finance specialty?',
    questionEn: 'What is your finance specialty?',
    options: [
      { value: 'Accounting', label: 'Accounting' },
      { value: 'Audit', label: 'Audit' },
      { value: 'Tax', label: 'Taxation' },
      { value: 'Financial Analysis', label: 'Financial Analysis' },
      { value: 'Investment Banking', label: 'Investment Banking' },
      { value: 'Any', label: 'Any Finance Role' }
    ],
    field: 'preferredIndustry',
    multiple: true
  }
];

// Default/Other category questions
export const defaultQuestions = [
  {
    id: 'default_job_type',
    question: 'What type of job are you looking for?',
    questionEn: 'What type of job are you looking for?',
    options: [
      { value: 'Full-time', label: 'Full-time' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract Based' },
      { value: 'Remote', label: 'Remote/Work from Home' }
    ],
    field: 'preferredJobType'
  },
  {
    id: 'default_salary',
    question: 'What is your expected salary (per annum)?',
    questionEn: 'What is your expected salary?',
    options: [
      { value: '2-4', label: '₹2-4 Lakh' },
      { value: '4-6', label: '₹4-6 Lakh' },
      { value: '6-10', label: '₹6-10 Lakh' },
      { value: '10-15', label: '₹10-15 Lakh' },
      { value: '15+', label: '₹15+ Lakh' }
    ],
    field: 'expectedSalary'
  },
  {
    id: 'default_location',
    question: 'Which city do you prefer to work in?',
    questionEn: 'Which city do you prefer?',
    options: [
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi NCR', label: 'Delhi/NCR' },
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Any', label: 'Any Location' }
    ],
    field: 'preferredLocation',
    multiple: true
  },
  {
    id: 'default_industry',
    question: 'Which industry are you interested in?',
    questionEn: 'Which industry are you interested in?',
    options: [
      { value: 'IT', label: 'IT/Software' },
      { value: 'Sales', label: 'Sales & Marketing' },
      { value: 'Finance', label: 'Finance & Banking' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Education', label: 'Education' },
      { value: 'Any', label: 'Any Industry' }
    ],
    field: 'preferredIndustry',
    multiple: true
  }
];

/**
 * Get questions based on resume category
 */
export const getQuestionsByCategory = (category) => {
  let categoryQuestions = [];
  
  switch(category) {
    case 'Technical':
      categoryQuestions = technicalQuestions;
      break;
    case 'Sales':
      categoryQuestions = salesQuestions;
      break;
    case 'Marketing':
      categoryQuestions = marketingQuestions;
      break;
    case 'Finance':
      categoryQuestions = financeQuestions;
      break;
    default:
      categoryQuestions = defaultQuestions;
  }
  
  // Combine category-specific questions with common questions
  return [...categoryQuestions, ...commonQuestions];
};

/**
 * Get welcome message based on category
 */
export const getWelcomeMessage = (name, category) => {
  const categoryMessages = {
    Technical: `Hi ${name}! 🚀 I see you're a Technical professional. I'll ask a few questions to find perfect tech jobs for you.`,
    Sales: `Hi ${name}! 💼 I noticed your Sales background. I'll ask some questions to find the best sales opportunities for you.`,
    Marketing: `Hi ${name}! 📱 Great to see your Marketing experience! I'll ask a few questions to find perfect marketing roles for you.`,
    Finance: `Hi ${name}! 💰 Your Finance background is impressive! I'll ask some questions to find suitable finance jobs for you.`,
    Healthcare: `Hi ${name}! 🏥 I see your experience in the Healthcare sector. I'll help you find the best opportunities.`,
    Education: `Hi ${name}! 📚 Great to see your passion in Education! I'll find perfect teaching roles for you.`,
    Design: `Hi ${name}! 🎨 Impressed by your creative background! I'll find the best design opportunities for you.`,
    HR: `Hi ${name}! 👥 Your experience in HR is valuable! I'll find perfect HR roles for you.`,
    Operations: `Hi ${name}! ⚙️ I see your expertise in Operations. I'll find the best opportunities for you.`,
    Other: `Hi ${name}! 👋 I received your resume. I'll ask a few questions to find the perfect job for you.`
  };
  
  return categoryMessages[category] || categoryMessages.Other;
};
