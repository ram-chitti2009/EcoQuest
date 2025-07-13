// Type definitions
export interface College {
  id: number;
  name: string;
}

export interface CollegeWithDecision extends College {
  decisionType: string;
}

export interface Essay {
  id: string;
  title: string;
  wordCount: number;
}

// Decision types
export const decisionTypes = [
  { label: "Early Decision", value: "early" },
  { label: "Regular Decision", value: "regular" },
  { label: "Rolling Admission", value: "rolling" },
  { label: "Waitlist", value: "waitlist" },
];

export const collegeData = [
  { id: 1, name: "Harvard University" },
  { id: 2, name: "Stanford University" },
  { id: 3, name: "MIT" },
  { id: 4, name: "Princeton University" },
  { id: 5, name: "Yale University" },
  { id: 6, name: "Columbia University" },
  { id: 7, name: "University of Chicago" },
  { id: 8, name: "University of Pennsylvania" },
  { id: 9, name: "California Institute of Technology" },
  { id: 10, name: "Duke University" },
];

// This would likely come from a separate database table or API endpoint
export const supplementalEssayData = {
  1: [
    // Harvard
    { id: "1-1", title: "Why Harvard?", wordCount: 250 },
    { id: "1-2", title: "Extracurricular Activity", wordCount: 150 },
    { id: "1-3", title: "Additional Information", wordCount: 500 },
  ],
  2: [
    // Stanford
    { id: "2-1", title: "Letter to Future Roommate", wordCount: 250 },
    { id: "2-2", title: "What Matters to You?", wordCount: 250 },
  ],
  3: [
    // MIT
    { id: "3-1", title: "Describe Your Background", wordCount: 200 },
    { id: "3-2", title: "World Problems", wordCount: 250 },
  ],
  4: [
    // Princeton
    { id: "4-1", title: "Unusual Summer Activity", wordCount: 350 },
  ],
  // Add more essays for other colleges as needed
};
