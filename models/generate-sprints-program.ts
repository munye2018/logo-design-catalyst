export default function generateProgram({bestTime}: any ) { // startDate, programType, event, 
  const programLength = 20
  const deloadFrequency = 4
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  var progression = 0 // 0 => >= 12.00, 1 => 12.00-11.50, 2 => 11.50-11.00, 3 => 11.00-10.75, 4 => 10.75-10.50

  if (bestTime >= 12.00) {
    progression = 0
  } else if (bestTime >= 11.50) {
    progression = 1
  } else if (bestTime >= 11.00) {
    progression = 2
  } else if (bestTime >= 10.75) {
    progression = 3
  } else if (bestTime >= 10.50) {
    progression = 4
  }

  var program = []

  const stages = 
  {
    deload: {
      stageName: "Deload",
      sessionNames: ["Hills", "Active Recovery", "Extensive Tempo", "Bodyweight Core Circuit", "Extensive Tempo", "Hypertrophy Weight Training", "Rest"],
      details: ["45 mins", "Aim for 10k steps", "45 mins, track, trainers", "45 mins, home or gym, repeat 3 times", "45 mins, track, trainers", "105 mins, gym", "Complete Rest"],
      session: [["warmUp","hills","warmDown"],["activeRecovery"],["warmUp","extensiveTempo","warmDown"],["circuit"],["warmUp","extensiveTempo","warmDown"],["hypertrophy"],["rest"]]
    },
    offseason: {
      stageName: "Offseason",
      sessionNames: ["Hills", "Active Recovery", "Work Capacity", "Bodyweight Core Circuit", "Extensive Tempo", "Hypertrophy Weight Training", "Rest"],
      details: ["45 mins", "Aim for 10k steps", "45 mins, track, trainers", "45 mins, home or gym, repeat 3 times", "45 mins, track, trainers", "105 mins, gym", "Complete Rest"],
      session: [["warmUp","hills","warmDown"], ["activeRecovery"],["warmUp","intensiveTempo","warmDown"],["circuit"], ["warmUp","extensiveTempo","warmDown"],["hypertrophy"],["rest"]]
    },
    general: {
      stageName: "General Preparation",
      sessionNames: ["Acceleration", "Active Recovery", "Max Velocity", "Bodyweight Core Circuit", "Extensive Tempo", "Hypertrophy Weight Training", "Rest"],
      details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, home or gym, repeat 3 times", "45 mins, track, trainers", "105 mins, gym", "Complete Rest"],
      session: [["warmUp","acceleration","warmDown"],["activeRecovery"], ["warmUp","maxVelocity","warmDown"],["circuit"],["warmUp","extensiveTempo", "warmDown"],["hypertrophy"],["rest"]]
    },
    specific: {
      stageName: "Specific Preparation",
      sessionNames: ["Acceleration", "Active Recovery", "Max Velocity", "Bodyweight Core Circuit", "Speed Endurance", "Max Strength Weight Training", "Rest"],
      details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, home or gym, repeat 3 times", "45 mins, track, spikes", "105 mins, gym", "Complete Rest"],
      session: [["warmUp","acceleration","warmDown"],["activeRecovery"], ["warmUp","maxVelocity","warmDown"],["circuit"],["warmUp","speedEndurance", "warmDown"],["hypertrophy"],["rest"]]
    },
    preComp: {
      stageName: "Pre-Competition",
      sessionNames: ["Acceleration", "Active Recovery", "Max Velocity", "Bodyweight Core Circuit", "Speed Endurance", "Power Weight Training", "Rest"],
      details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, home or gym, repeat 3 times", "45 mins, track, spikes", "105 mins, gym", "Complete Rest"],
      session: [["warmUp","acceleration","warmDown"],["activeRecovery"], ["warmUp","maxVelocity","warmDown"],["circuit"],["warmUp","speedEndurance","warmDown"],["hypertrophy"],["rest"]]
    }
  }

  const exercises =
  {
    acceleration: 
    [
      {
        name: "Acceleration",
        distance: 10,
        reps: 15,
        pace: 1.00,
        recovery: 1
      },
      {
        name: "Acceleration",
        distance: 20,
        reps: 10,
        pace: 1.00,
        recovery: 2
      },
      {
        name: "Acceleration",
        distance: 30,
        reps: 8,
        pace: 1.00,
        recovery: 3
      },
      {
        name: "Acceleration",
        distance: 40,
        reps: 6,
        pace: 1.00,
        recovery: 4
      },
      {
        name: "Acceleration",
        distance: 50,
        reps: 4,
        pace: 1.00,
        recovery: 5
      }
    ],
    maxVelocity:
    [
      {
        name: "Max Velocity",
        distance: 40,
        reps: 6,
        pace: 0.98,
        recovery: 4
      },
      {
        name: "Max Velocity",
        distance: 50,
        reps: 4,
        pace: 0.98,
        recovery: 5
      },
      {
        name: "Max Velocity",
        distance: 60,
        reps: 4,
        pace: 0.98,
        recovery: 6
      },
      {
        name: "Max Velocity",
        distance: 70,
        reps: 4,
        pace: 0.98,
        recovery: 7
      },
      {
        name: "Max Velocity",
        distance: 80,
        reps: 4,
        pace: 0.98,
        recovery: 8
      }
    ],
    speedEndurance:
    [
      {
        name: "Speed Endurance",
        distance: 80,
        reps: 4,
        pace: 0.95,
        recovery: 9
      },
      {
        name: "Speed Endurance",
        distance: 90,
        reps: 4,
        pace: 0.95,
        recovery: 9
      },
      {
        name: "Speed Endurance",
        distance: 100,
        reps: 3,
        pace: 0.95,
        recovery: 10
      },
      {
        name: "Speed Endurance",
        distance: 120,
        reps: 3,
        pace: 0.95,
        recovery: 12
      },
      {
        name: "Speed Endurance",
        distance: 150,
        reps: 3,
        pace: 0.95,
        recovery: 15
      }
    ],
    specificEndurance:
    [
      {
        name: "Specific Endurance",
        distance: 200,
        reps: 3,
        pace: 0.95,
        recovery: 20
      },
      {
        name: "Specific Endurance",
        distance: 250,
        reps: 3,
        pace: 0.90,
        recovery: 20
      },
      {
        name: "Specific Endurance",
        distance: 300,
        reps: 3,
        pace: 0.90,
        recovery: 20
      },
      {
        name: "Specific Endurance",
        distance: 400,
        reps: 3,
        pace: 0.90,
        recovery: 20
      },
      {
        name: "Specific Endurance",
        distance: 500,
        reps: 3,
        pace: 0.90,
        recovery: 20
      },
      {
        name: "Specific Endurance",
        distance: 600,
        reps: 3,
        pace: 0.90,
        recovery: 20
      }
    ],
    hills: [
      {
        name: "Hills",
        distance: 30,
        reps: 10,
        pace: 0.90,
        recovery: 3
      },
    ],
    intensiveTempo: 
    [
      {
        name: "Intensive Tempo",
        distance: 100,
        reps: 6,
        pace: 0.85,
        recovery: 3
      },
      {
        name: "Intensive Tempo",
        distance: 200,
        reps: 5,
        pace: 0.85,
        recovery: 5
      },
      {
        name: "Intensive Tempo",
        distance: 250,
        reps: 4,
        pace: 0.85,
        recovery: 5
      },
      {
        name: "Intensive Tempo",
        distance: 300,
        reps: 3,
        pace: 0.85,
        recovery: 5
      }
    ],
    extensiveTempo:
    [
      {
        name: "Extensive Tempo",
        distance: 100,
        reps: 5,
        pace: 0.70,
        recovery: 2
      },
      {
        name: "Extensive Tempo",
        distance: 100,
        reps: 10,
        pace: 0.75,
        recovery: 2
      },
      {
        name: "Extensive Tempo",
        distance: 200,
        reps: 5,
        pace: 0.70,
        recovery: 3
      },
      {
        name: "Extensive Tempo",
        distance: 200,
        reps: 8,
        pace: 0.75,
        recovery: 3
      },
      {
        name: "Extensive Tempo",
        distance: 300,
        reps: 6,
        pace: 0.75,
        recovery: 4
      },
      {
        name: "Extensive Tempo",
        distance: 400,
        reps: 5,
        pace: 0.75,
        recovery: 5
      }
    ],
    warmUp: [
      {
        name: "Warm up",
        details: "A Skips, B Skips, C Skips, 2 Strides",
        duration: "15m"
      }
    ],
    warmDown:
    [
      {
        name: "Warm down",
        details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
        duration: "15m"
      }
    ],
    circuit:
    [
      {
        name: "Bodyweight Core Circuit",
        details: "45 mins, home or gym, repeat 3 times",
        session: 
        [
          {
            id: 0,
            name: "Warm up",
            details: "Hamstring Stretch, Glute Stretch, Pigeon Stretch into Chest Stretch, Donkey Kickbacks",
            duration: "15m"
          },
          {
            id: 1,
            name: "Russian Twists",
            details: "3-5kg med ball",
            duration: "15s"
          },
          {
            id: 2,
            name: "Step up and Drive",
            details: "40cm box. Resisted by partner with band",
            duration: "15s"
          },
          {
            id: 3,
            name: "Plyo Box Jump",
            details: "40cm Box",
            duration: "2 Reps"
          },
          {
            id: 4,
            name: "Pushups",
            details: "With clap from Command",
            duration: "60s"
          },
          {
            id: 5,
            name: "Kettle Bell Swings",
            details: "8kg Kettle Bell",
            duration: "30s"
          },
          {
            id: 6,
            name: "Plank with Ball Roll",
            details: "Keeping hips and ribs connected with pelvis tucked",
            duration: "2 Reps"
          },
          {
            id: 7,
            name: "Hamstring Tantrums or Static Holds",
            details: "Swiss Ball or Elevated Surface",
            duration: "10s"
          },
          {
            id: 8,
            name: "Single Legged Calf Raises",
            details: "Fast on the way up, slow on the way down. Do on a step",
            duration: "10 Reps"
          },
          {
            id: 9,
            name: "Banded Adductor Pulls or Elevated Adductor Hold",
            details: "Fast in, slow return",
            duration: "15 Reps or 15s"
          },
          {
            id: 10,
            name: "Medball Throw or Broad Jump",
            details: "Vertical Throw from Counter Movement",
            duration: "3 Reps"
          }
        ]
      }
    ],
    hypertrophy:
    [
      {
        name: "Hypertrophy Weight Training",
        details: "105 mins, gym",
        session: 
        [
          {
            id: 0,
            name: "Split Squats or Walking Lunge",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 1,
            name: "Single Legged RDL",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 2,
            name: "Single Legged Calf Raise",
            details: "20% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 3,
            name: "Hamstring Curls",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 4,
            name: "Dumbell Bench Press",
            details: "30% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 5,
            name: "Dumbell Rows",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 6,
            name: "Dumbell Strict Press",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets"
          },
          {
            id: 7,
            name: "Pull Ups",
            details: "Chin to bar and full extension at the bottom",
            duration: "As many as possible"
          }
        ]
      }
    ],
    activeRecovery:
    [
      {
        id: 0,
        name: "Active Recovery",
        details: "Cycling, walking, skipping or cross-training",
        duration: "60m",
      }
    ],
    rest:
    [
      {
        id: 0,
        name: "Rest",
        details: "Complete Rest",
        duration: "24h"
      }
    ]
  }

  for (let week = 0, stage = 'offseason'; week < programLength; week++) {
    let sessions = []

    if (week >= 0 && week < 4) {
      stage = 'offseason'
    } else if (week >= 4 && week < 8) {
      stage = 'general'
    } else if (week >= 8 && week < 16) {
      stage = 'specific'
    } else if (week >= 16 && week < 20) {
      stage = 'preComp'
    }

    if ((week + 1) % deloadFrequency == 0) {
      stage = 'deload'
    }

    for (let day = 0; day < 7; day++) {
      let session = []

      if (stage != 'offseason') {
        stages[stage].session[day].forEach(function(item) {
          session.push(exercises[item][progression]);
        });
      } else {
        stages[stage].session[day].forEach(function(item) {
          session.push(exercises[item][0]);
        });
      }

      sessions.push(
      {
        id: day,
        name: stages[stage].sessionNames[day],
        details: stages[stage].details[day],
        day: daysOfWeek[day],
        completed: false,
        session: session
      })
    }

    program.push(
    {
      id: week,
      name: stages[stage].stageName,
      completed: false,
      sessions: sessions
    })
  }
  
  return program
}