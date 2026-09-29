/* Placeholder sample content — to be replaced with the real GAMEMOB MOOC material. */
const COURSE = {
  title: "Play, Learn, Move Sustainably",
  modules: [
    {
      id: "m1",
      title: "Sustainable Mobility Basics",
      lessons: [
        {
          id: "m1l1",
          title: "What Is Sustainable Mobility?",
          body: `
            <p>Sustainable mobility means moving people and goods in ways that meet today's needs without compromising the environment, safety, or quality of life for future generations.</p>
            <p>In this lesson you'll explore the three pillars of sustainable transport — environmental, social, and economic — and see why cities across Europe are rethinking how streets are designed.</p>
            <ul>
              <li>Why "more roads" doesn't solve congestion</li>
              <li>The transport hierarchy: walking, cycling, public transport, shared mobility, private cars</li>
              <li>How mobility choices connect to climate goals</li>
            </ul>
          `
        },
        {
          id: "m1l2",
          title: "Why Cities Need to Change How We Move",
          body: `
            <p>Urban areas are growing fast, and traffic, noise, and air pollution are growing with them. This lesson looks at real examples from RIS regions in Greece and Serbia.</p>
            <p>You'll learn how small daily choices — like walking to school instead of being driven — add up to measurable change at the city level.</p>
          `
        }
      ],
      quiz: {
        id: "m1q",
        title: "Module 1 Check",
        questions: [
          {
            q: "Which of these is NOT one of the three pillars of sustainable mobility?",
            options: ["Environmental", "Social", "Entertainment", "Economic"],
            correct: 2
          },
          {
            q: "In the transport hierarchy, which mode is generally prioritized first?",
            options: ["Private cars", "Walking", "Air travel", "Freight trucks"],
            correct: 1
          }
        ]
      }
    },
    {
      id: "m2",
      title: "Traffic Safety",
      lessons: [
        {
          id: "m2l1",
          title: "Understanding Road Risks",
          body: `
            <p>Road traffic injuries remain one of the leading causes of harm to young people. This lesson breaks down the most common risk factors near schools and residential streets.</p>
            <ul>
              <li>Speed and stopping distance</li>
              <li>Visibility and blind spots</li>
              <li>Distraction — for drivers and pedestrians alike</li>
            </ul>
          `
        },
        {
          id: "m2l2",
          title: "Safe Behavior for Pedestrians & Cyclists",
          body: `
            <p>Practical habits that reduce risk: crossing at marked points, making eye contact with drivers, using lights and reflective gear when cycling at dusk, and choosing safer routes.</p>
          `
        }
      ],
      quiz: {
        id: "m2q",
        title: "Module 2 Check",
        questions: [
          {
            q: "What is the safest place to cross a street?",
            options: ["Anywhere with a gap in traffic", "A marked crossing", "Behind a parked bus", "Mid-block, running"],
            correct: 1
          }
        ]
      }
    },
    {
      id: "m3",
      title: "Environmental Impacts",
      lessons: [
        {
          id: "m3l1",
          title: "Transport & Climate Change",
          body: `
            <p>Transport is one of the largest sources of greenhouse gas emissions in the EU. This lesson connects everyday travel choices to the bigger climate picture.</p>
          `
        },
        {
          id: "m3l2",
          title: "Air Quality and Urban Life",
          body: `
            <p>Beyond climate, vehicle emissions affect the air we breathe every day. You'll see how traffic patterns near schools influence local air quality and health.</p>
          `
        }
      ],
      quiz: {
        id: "m3q",
        title: "Module 3 Check",
        questions: [
          {
            q: "Which sector is among the largest sources of CO2 emissions in the EU?",
            options: ["Agriculture", "Transport", "Textile manufacturing", "Publishing"],
            correct: 1
          }
        ]
      }
    },
    {
      id: "m4",
      title: "Active Mobility",
      lessons: [
        {
          id: "m4l1",
          title: "Walking & Cycling as Everyday Transport",
          body: `
            <p>Active mobility isn't just exercise — it's a practical way to get around that also improves concentration, mood, and independence for students.</p>
          `
        },
        {
          id: "m4l2",
          title: "Micromobility: Bikes, Scooters, and More",
          body: `
            <p>An overview of the growing range of active and shared mobility options, and the infrastructure (bike lanes, parking, shared schemes) that makes them safe and viable.</p>
          `
        }
      ],
      quiz: {
        id: "m4q",
        title: "Module 4 Check",
        questions: [
          {
            q: "Which of these is an example of active mobility?",
            options: ["Driving a car", "Cycling to school", "Taking a flight", "Riding in a taxi"],
            correct: 1
          }
        ]
      }
    },
    {
      id: "m5",
      title: "Innovation",
      lessons: [
        {
          id: "m5l1",
          title: "Smart Mobility Technologies",
          body: `
            <p>From real-time transit apps to sensor-based traffic management, technology is reshaping how cities move. This lesson introduces the innovations behind "smart mobility."</p>
          `
        },
        {
          id: "m5l2",
          title: "Designing the Mobility of Tomorrow",
          body: `
            <p>You'll wrap up the course by imagining and sketching your own idea for a more sustainable, safer way to move around your city — the same kind of thinking behind the GAMEMOB serious game.</p>
          `
        }
      ],
      quiz: {
        id: "m5q",
        title: "Module 5 Check",
        questions: [
          {
            q: "What is an example of a 'smart mobility' technology?",
            options: ["A paper bus timetable", "A real-time transit app", "A horse-drawn cart", "A printed map"],
            correct: 1
          }
        ]
      }
    }
  ]
};
