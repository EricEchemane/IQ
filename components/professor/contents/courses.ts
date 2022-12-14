export const BSCPE_COURSES = [
    'MAT 111E-Calculus 1',
    'MAT 100 - Mathematics in the World',
    'CPE 111 - Computer Engineering as a Discipline',
    'NSTP 101 - National Service Training Program 1 (NSTP)',
    'NSCI 111E-Chemistry for Engineers (Lecture) ',
    'GE 104 - Purposive Communication',
    'CPE 112L - Programming Logic Design',
    'GE 101 - Understanding the Self ',
    'NSCI 111E-Chemistry for Engineers (Laboratory)',
    'PE 111 - Physical Education 1 (P.E)',
    'MAT 211E-Differential Equation',
    'GE 106 - Science Technology and Society',
    'ENG 211 - Engineering Economy',
    'CPE 211L - Object Oriented Programming',
    'GE 105 - Art Appreciation',
    'DR 211L - Computer Aided Drafting',
    'EE 211 - Fundamentals of Electrical Circuits (Lecture)',
    'EE 211 - Fundamentals of Electrical Circuits (Laboratory)',
    'PE 113 - Physical Education 3',
];

export const BSIS_COURSES = [
    'ITE 101-Computer Programming 1 (Laboratory)',
    'ITE 101-Computer Programming 1 (Lecture)',
    'ITE 100-Introduction to Computing (Laboratory)',
    'ITE 100-Introduction to Computing (Lecture)',
    'MAT 100-Mathemathics in Modern world',
    'NSTP 100-National Service Training Program 1',
    'PE 111-Physical Education 1',
    'GE 104-Purposive Communication',
    'GE 101-Understanding the Self',
    'IS 101 - Fundamental of Information System',
    'ITE 102 - Computer Programming 2 (Laboratory)',
    'ITE 102Computer Programming 2 (Lecture)',
    'MAT 101 - Discrete Math',
    'GE 102 - Readings in Philippine History',
    'GE 107 - Ethics',
    'NSTP 102 - National Service Training Program 2',
    'PE 112 - Physical Education 2',
    'Data Structure & algorithm Analysis',
    'The Contemporary World',
    'Science, Technology & Society',
    'Web Application & Design',
    'IT Infrastructure & Network Technologies',
    'Organization & Management Concepts',
    'Physical Education 3',
    'Database Management System',
    'Data Communication and Networking',
    'Professional Issues in IS',
    'Financial Management',
    'Environmental Science',
    'Physical Education 4',
    'Professional Elective 1 (IT Service Management)',
    'ITE 104 - Informatio Management',
    'IS 104 - System Analysis and Design',
    'DM 103 - Business Process Design and Management',
    'IS 105 - Enterprise Architecture',
    'MAT 110 Quantitative Methods',
    'FIL 101 - Masining na Pagpapahayag',
    'ADV 01 - Enterprise Systems',
    'CAP 101 IS - Capstone Project 1',
    'DM 104 - Evaluation of Business Performance',
    'GE 111 - Rizal\'s Life and Works',
    'IS1 08 - IT Security and Management (Lecture)',
    'IS1 08 - IT Security and Management (Laboratory)',
    'FIL 102 - Lingwistika',
    'IS 106 - IS Project Management 1',
    'ADV 02 - IT Audit and Controls',
    'CAP 102 - IS Strategy, Management and Acquisition',
    'IS 107 - Applications Development and Emerging Technologies (Lecture)',
    'IS 110 - Applications Development and Emerging Technologies (Laboratory)',
    'IS 109 - Human Computer Interaction',
    'GE 105 - Art Appreciation',
    'BST 100 - Business Etiquette and Social Races Training',
    'ADV 03 - Professional Elective 4 (IS Innovations and New Technologies)',
];


export const getProgramAbbreviation = (program: string) => {
    switch (program) {
        case 'Bachelor of Science in Information System | BSIS':
            return 'BSIS';
        case 'Bachelor of Science in Computer Engineering | BSCPE':
            return 'BSCPE';
        default:
            return '';
    }
};