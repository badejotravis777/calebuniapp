export const tabs = [
    { id: "Home", icon: "home-outline", label: "Home" },
    { id: "Courses", icon: "folder-outline", label: "Courses" },
    { id: "Schedule", icon: "calendar-outline", label: "Schedule" },
    { id: "Community", icon: "people-outline", label: "Community" },
    { id: "Profile", icon: "person-outline", label: "Profile" },
  ];
  
  export const homeCourses = [
    {
      id: "1",
      title: "Computer\nScience",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "2",
      title: "Mathematics",
      image:
        "https://images.unsplash.com/photo-1632516643720-e7f5d7d6eca1?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "3",
      title: "History &\nGeography",
      image:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80",
    },
  ];
  
  export const newsData = [
    {
      id: "1",
      title: "ASUU Update",
      desc: "The Academic Staff Union of Universities has released the new calendar.",
      date: "May 01",
      badgeBg: "#E0F2FE",
      badgeText: "#0284C7",
    },
    {
      id: "2",
      title: "NUC Directive",
      desc: "The National Universities Commission has issued a new directive on grading.",
      date: "June 07",
      badgeBg: "#DCFCE7",
      badgeText: "#16A34A",
    },
  ];
  
  export const eventsData = [
    {
      id: "1",
      title: "Tech Fest Lagos",
      location: "Lagos",
      date: "Wed, 28 Feb 2026",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80",
    },
  ];
  
  export const allCoursesList = [
    "Digital Marketing",
    "Design Learning",
    "Artificial Intelligence",
    "Software Management",
    "Digital Logical Thoughts",
    "Web 3.0",
    "Calculus",
  ];
  
  export const scheduleDays = [
    { day: "S", date: "04" },
    { day: "S", date: "05" },
    { day: "M", date: "06", active: true },
    { day: "T", date: "07" },
    { day: "W", date: "08" },
    { day: "T", date: "09" },
    { day: "F", date: "10" },
  ];
  
  export const scheduleItems = [
    {
      id: "1",
      startTime: "11:35",
      endTime: "13:05",
      title: "Computer Science",
      subtitle: "Lecture 2: Data management",
      room: "Room 2 - 124",
      instructor: "Dr. Adeola",
      bg: "#8DF08B",
      textPrimary: "#111",
      textSecondary: "#111",
      iconColor: "#111",
    },
    {
      id: "2",
      startTime: "13:15",
      endTime: "14:45",
      title: "Digital Marketing",
      subtitle: "Lecture 3: Shopify Creation",
      room: "Room 3A - G4",
      instructor: "Mrs. Nwachukwu",
      bg: "#D9FA5A",
      textPrimary: "#E11D48",
      textSecondary: "#E11D48",
      iconColor: "#E11D48",
    },
  ];
  
  export type Message = {
    id: string;
    sender: string;
    text: string;
    time: string;
    isSystem?: boolean;
    isMe?: boolean;
  };
  
  export const mockMessages: Message[] = [
    {
      id: "1",
      sender: "System",
      text: "Welcome to the CS - 100 Level group chat!",
      time: "09:00 AM",
      isSystem: true,
    },
    {
      id: "2",
      sender: "Chidi",
      text: "Hey guys! Has anyone started the programming assignment?",
      time: "10:15 AM",
      isMe: false,
    },
    {
      id: "4",
      sender: "Me",
      text: "I'm stuck on question 3. Anyone available to discuss it later?",
      time: "10:25 AM",
      isMe: true,
    },
  ];



  