// utils/dummyData.ts

export const triviaGames = [
    {
      id: "t1",
      question: "Who is the strictest lecturer in your department?",
      options: ["Dr. Babatunde", "Prof. Akinola", "Mr. Ojo", "Mrs. Balogun"],
    },
    {
      id: "t2",
      question: "What's the best food spot on campus?",
      options: ["Cafeteria 1", "Mama Put", "Student Center", "The Bakery"],
    },
  ];
  
  export const universityData = {
    "Computer Science": {
      "100": {
        courses: [
          { id: "c1", title: "CSC 101: Intro to Computing" },
          { id: "c2", title: "MTH 101: General Mathematics I" },
          { id: "c3", title: "PHY 101: General Physics I" },
        ],
        schedule: [
          { id: "s1", title: "CSC 101", time: "08:00 - 10:00", location: "Hall A", day: "Monday" },
        ] // Imagine some days have an empty schedule array
      },
      "200": {
        courses: [
          { id: "c4", title: "CSC 201: Digital Thinking" },
          { id: "c5", title: "CSC 205: Operating Systems" },
          { id: "c6", title: "MTH 201: Advanced Calculus" },
        ],
        schedule: [
          { id: "s2", title: "CSC 201", time: "09:00 - 11:00", location: "Main Auditorium", day: "Today" },
        ]
      }
    },
    "Business Administration": {
      "100": {
        courses: [
          { id: "b1", title: "BUS 101: Intro to Business" },
          { id: "b2", title: "ECO 101: Principles of Economics" },
        ],
        schedule: [] // Empty schedule triggers the game!
      }
    }
  };