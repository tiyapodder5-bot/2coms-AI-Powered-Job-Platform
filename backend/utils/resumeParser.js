import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

/**
 * Extract text from PDF or DOCX file
 */
export const extractTextFromFile = async (filePath) => {
  try {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } else if (fileExtension === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file format. Only PDF and DOCX are allowed.');
    }
  } catch (error) {
    throw new Error(`File extraction failed: ${error.message}`);
  }
};

/**
 * Extract 30 most relevant keywords from resume text
 */
export const extractKeywords = (text) => {
  // Remove special characters and convert to lowercase
  const cleanText = text.toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Common stop words to ignore
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him',
    'using', 'used', 'use', 'work', 'working', 'worked', 'experience'
  ]);
  
  // Technical and professional keywords weight
  const importantKeywords = new Set([
    'python', 'java', 'javascript', 'react', 'node', 'angular', 'vue',
    'mongodb', 'sql', 'mysql', 'postgresql', 'aws', 'azure', 'docker',
    'kubernetes', 'api', 'rest', 'graphql', 'git', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'analytics', 'tableau',
    'sales', 'marketing', 'crm', 'salesforce', 'seo', 'sem', 'b2b', 'b2c',
    'finance', 'accounting', 'excel', 'powerpoint', 'communication',
    'leadership', 'management', 'project management', 'team lead',
    'full stack', 'frontend', 'backend', 'devops', 'cloud', 'microservices'
  ]);
  
  // Split into words
  const words = cleanText.split(' ');
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
      // Give extra weight to important keywords
      if (importantKeywords.has(word)) {
        wordCount[word] += 5;
      }
    }
  });
  
  // Also check for multi-word phrases (bigrams)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (importantKeywords.has(bigram)) {
      wordCount[bigram] = (wordCount[bigram] || 0) + 10; // High weight for phrases
    }
  }
  
  // Sort by frequency and get top 30
  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 30);
  
  return sortedWords;
};

/**
 * Detect resume category based on keywords and content
 */
export const detectCategory = (keywords, fullText) => {
  const text = fullText.toLowerCase();
  
  // Category detection rules with scoring
  const categoryScores = {
    Technical: 0,
    Sales: 0,
    Marketing: 0,
    Finance: 0,
    Healthcare: 0,
    Education: 0,
    Design: 0,
    HR: 0,
    Operations: 0
  };
  
  // Technical keywords
  const technicalKeywords = [
    'python', 'java', 'javascript', 'react', 'angular', 'node', 'vue', 'php',
    'c++', 'c#', 'ruby', 'golang', 'swift', 'kotlin', 'typescript',
    'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'oracle',
    'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab', 'api', 'rest', 'graphql', 'microservices',
    'developer', 'software engineer', 'programmer', 'full stack', 'frontend',
    'backend', 'devops', 'machine learning', 'ai', 'data science', 'ml',
    'algorithm', 'data structure', 'android', 'ios', 'mobile app'
  ];
  
  // Sales keywords
  const salesKeywords = [
    'sales', 'business development', 'bd', 'crm', 'salesforce', 'client',
    'revenue', 'target', 'quota', 'pipeline', 'lead generation', 'b2b', 'b2c',
    'account manager', 'relationship', 'negotiation', 'cold calling', 'demos',
    'deals', 'closing', 'customer acquisition', 'sales executive'
  ];
  
  // Marketing keywords
  const marketingKeywords = [
    'marketing', 'digital marketing', 'seo', 'sem', 'social media', 'content',
    'campaign', 'branding', 'advertising', 'google ads', 'facebook ads',
    'instagram', 'linkedin', 'email marketing', 'analytics', 'google analytics',
    'conversion', 'engagement', 'influencer', 'ppc', 'roi', 'market research'
  ];
  
  // Finance keywords
  const financeKeywords = [
    'finance', 'accounting', 'audit', 'tax', 'financial', 'bookkeeping',
    'accounts payable', 'accounts receivable', 'balance sheet', 'p&l',
    'budget', 'forecasting', 'investment', 'banking', 'cpa', 'ca',
    'quickbooks', 'sap', 'tally', 'financial analyst', 'excel', 'reconciliation'
  ];
  
  // Healthcare keywords
  const healthcareKeywords = [
    'healthcare', 'medical', 'doctor', 'nurse', 'physician', 'clinical',
    'patient', 'hospital', 'pharmacy', 'medicine', 'nursing', 'surgeon',
    'healthcare', 'medical records', 'ehr', 'emr', 'hipaa', 'diagnosis'
  ];
  
  // Education keywords
  const educationKeywords = [
    'teacher', 'professor', 'education', 'teaching', 'tutor', 'trainer',
    'instructor', 'curriculum', 'classroom', 'student', 'learning',
    'academic', 'school', 'university', 'college', 'education coordinator'
  ];
  
  // Design keywords
  const designKeywords = [
    'design', 'ui', 'ux', 'graphic', 'photoshop', 'illustrator', 'figma',
    'sketch', 'adobe', 'creative', 'visual', 'designer', 'ui/ux', 'wireframe',
    'prototype', 'user experience', 'user interface', 'typography', 'branding'
  ];
  
  // HR keywords
  const hrKeywords = [
    'hr', 'human resources', 'recruitment', 'hiring', 'onboarding', 'payroll',
    'employee', 'talent acquisition', 'staffing', 'interviewing', 'hris',
    'benefits', 'compensation', 'hr manager', 'recruiter'
  ];
  
  // Operations keywords
  const operationsKeywords = [
    'operations', 'logistics', 'supply chain', 'inventory', 'warehouse',
    'operations manager', 'process', 'optimization', 'lean', 'six sigma',
    'procurement', 'vendor', 'distribution', 'manufacturing'
  ];
  
  // Calculate scores for each category
  keywords.forEach(keyword => {
    if (technicalKeywords.includes(keyword)) categoryScores.Technical += 2;
    if (salesKeywords.includes(keyword)) categoryScores.Sales += 2;
    if (marketingKeywords.includes(keyword)) categoryScores.Marketing += 2;
    if (financeKeywords.includes(keyword)) categoryScores.Finance += 2;
    if (healthcareKeywords.includes(keyword)) categoryScores.Healthcare += 2;
    if (educationKeywords.includes(keyword)) categoryScores.Education += 2;
    if (designKeywords.includes(keyword)) categoryScores.Design += 2;
    if (hrKeywords.includes(keyword)) categoryScores.HR += 2;
    if (operationsKeywords.includes(keyword)) categoryScores.Operations += 2;
  });
  
  // Also check full text for phrases
  technicalKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Technical += 1;
  });
  salesKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Sales += 1;
  });
  marketingKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Marketing += 1;
  });
  financeKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Finance += 1;
  });
  healthcareKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Healthcare += 1;
  });
  educationKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Education += 1;
  });
  designKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Design += 1;
  });
  hrKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.HR += 1;
  });
  operationsKeywords.forEach(kw => {
    if (text.includes(kw)) categoryScores.Operations += 1;
  });
  
  // Find category with highest score
  let maxScore = 0;
  let detectedCategory = 'Other';
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  });
  
  // If no clear category (score too low), mark as Other
  if (maxScore < 3) {
    detectedCategory = 'Other';
  }
  
  return detectedCategory;
};

/**
 * Extract email from text
 */
export const extractEmail = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emails = text.match(emailRegex);
  return emails ? emails[0] : null;
};

/**
 * Extract phone number from text
 */
export const extractPhone = (text) => {
  // Indian phone number patterns
  const phoneRegex = /(\+91[-\s]?)?[6789]\d{9}|(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{3}[-.\s]??\d{4})/g;
  const phones = text.match(phoneRegex);
  return phones ? phones[0] : null;
};

/**
 * Extract skills from text
 */
export const extractSkills = (text, keywords) => {
  const commonSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
    'TypeScript', 'R', 'Scala', 'Rust', 'Perl', 'HTML', 'CSS', 'SQL',
    
    // Frameworks & Libraries
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Laravel', 'Rails', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS',
    
    // Databases
    'MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'Redis', 'Cassandra',
    'DynamoDB', 'Firebase', 'SQLite',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git',
    'GitHub', 'GitLab', 'Terraform', 'Ansible',
    
    // Other Technical
    'Machine Learning', 'AI', 'Data Science', 'REST API', 'GraphQL', 'Microservices',
    'Agile', 'Scrum', 'JIRA', 'Linux', 'Android', 'iOS',
    
    // Sales & Marketing
    'Salesforce', 'CRM', 'SEO', 'SEM', 'Google Analytics', 'Social Media Marketing',
    'Content Marketing', 'Email Marketing', 'Lead Generation', 'B2B Sales',
    
    // Other Professional
    'Excel', 'PowerPoint', 'Word', 'Tableau', 'Power BI', 'SAP', 'QuickBooks',
    'Communication', 'Leadership', 'Project Management', 'Team Management'
  ];
  
  const textLower = text.toLowerCase();
  const foundSkills = [];
  
  // Check each skill in the text
  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  // Also add relevant keywords as skills
  keywords.forEach(keyword => {
    const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    if (!foundSkills.includes(capitalizedKeyword) && foundSkills.length < 20) {
      foundSkills.push(capitalizedKeyword);
    }
  });
  
  return foundSkills.slice(0, 20); // Return top 20 skills
};

/**
 * Extract experience (in years)
 */
export const extractExperience = (text) => {
  const expPatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience\s*:?\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?\s+(?:of\s+)?experience/i,
    /total\s+experience\s*:?\s*(\d+)/i
  ];
  
  for (let pattern of expPatterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return 0; // Default to 0 if not found
};

/**
 * Extract education
 */
export const extractEducation = (text) => {
  const degrees = [
    'Ph.D', 'PhD', 'Masters', 'Master', 'M.Tech', 'M.E', 'MBA', 'MCA',
    'B.Tech', 'B.E', 'BCA', 'Bachelor', 'B.Sc', 'M.Sc', 'Diploma',
    'B.Com', 'M.Com', 'BBA', 'engineering', 'Computer Science'
  ];
  
  const foundDegrees = [];
  const textLower = text.toLowerCase();
  
  degrees.forEach(degree => {
    if (textLower.includes(degree.toLowerCase())) {
      if (!foundDegrees.includes(degree)) {
        foundDegrees.push(degree);
      }
    }
  });
  
  return foundDegrees.join(', ') || 'Not specified';
};

/**
 * Extract name (usually first line or after certain keywords)
 */
export const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Usually name is in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Check if line looks like a name (2-4 words, only letters)
    const words = line.split(' ').filter(w => w.length > 0);
    if (words.length >= 2 && words.length <= 4 && 
        words.every(w => /^[A-Za-z.]+$/.test(w))) {
      return line;
    }
  }
  
  return 'Not found';
};
