const localData = [
  {
    id: "0",
    name: "Week 1 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Short Hills",
        details: "45 mins",
        day: "Monday",
        completed: "true",
        session: [
          {
            id: 0,
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: 1,
            name: "Hills",
            details: "8 x 20m",
            duration: "3 Sets",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "3.94s"
              },
              {
                rep: "1",
                time: "3.68s"
              },
              {
                rep: "2",
                time: "3.52s"
              },
              {
                rep: "3",
                time: "3.54s"
              },
              {
                rep: "4",
                time: "3.67s"
              },
              {
                rep: "5",
                time: "3.48s"
              },
              {
                rep: "6",
                time: "3.99s"
              },
              {
                rep: "7",
                time: "4.03s"
              }
            ]
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: [
          {
            id: 0,
            name: "Active Recovery",
            details: "Cycling, walking, skipping or cross-training",
            duration: "60m",
            timed: "false"
          }
        ]
      },
      {
        id: "2",
        name: "Glycolytic Work Capacity",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: 0,
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: 1,
            name: "Tempo",
            details: "5 x 80m Standing Start",
            duration: "80% (9.54s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "9.94s"
              },
              {
                rep: "1",
                time: "9.68s"
              },
              {
                rep: "2",
                time: "9.52s"
              },
              {
                rep: "3",
                time: "9.54s"
              },
              {
                rep: "4",
                time: "10.03s"
              }
            ]
          },
          {
            id: 2,
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          }
        ]
      },
      {
        id: "3",
        name: "Bodyweight Core Circuit",
        details: "45 mins, home or gym, repeat 3 times",
        day: "Thursday",
        completed: "false",
        session: [
          {
            id: 0,
            name: "Warm up",
            details: "Hamstring Stretch, Glute Stretch, Pigeon Stretch into Chest Stretch, Donkey Kickbacks",
            duration: "15m",
            timed: "false"
          },
          {
            id: 1,
            name: "Russian Twists",
            details: "3-5kg med ball",
            duration: "15s",
            timed: "false"
          },
          {
            id: 2,
            name: "Step up and Drive",
            details: "40cm box. Resisted by partner with band",
            duration: "15s",
            timed: "false"
          },
          {
            id: 3,
            name: "Plyo Box Jump",
            details: "40cm Box",
            duration: "2 Reps",
            timed: "false"
          },
          {
            id: 4,
            name: "Pushups",
            details: "With clap from Command",
            duration: "60s",
            timed: "false"
          },
          {
            id: 5,
            name: "Kettle Bell Swings",
            details: "8kg Kettle Bell",
            duration: "30s",
            timed: "false"
          },
          {
            id: 6,
            name: "Plank with Ball Roll",
            details: "Keeping hips ans ribs connected with pelvis tucked",
            duration: "2 Reps",
            timed: "false"
          },
          {
            id: 7,
            name: "Hamstring Tantrums or Static Holds",
            details: "Swiss Ball or Elevated Surface",
            duration: "10s",
            timed: "false"
          },
          {
            id: 8,
            name: "Calf Raises",
            details: "Fast on the way up, slow on the way down. Do on a step",
            duration: "10 Reps",
            timed: "false"
          },
          {
            id: 9,
            name: "Banded Adductor Pulls or Elevated Adductor Hold",
            details: "Fast in, slow return",
            duration: "15 Reps or 15s",
            timed: "false"
          },
          {
            id: 10,
            name: "Medball Throw or Broad Jump",
            details: "Vertical Throw from Counter Movement",
            duration: "3 Reps",
            timed: "false"
          }
        ]
      },
      {
        id: "4",
        name: "Extensive Tempo",
        details: "45 mins, track",
        day: "Friday",
        completed: "false",
        session: [
          {
            id: 0,
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: 1,
            name: "Extensive Tempo",
            details: "3 x 200m Standing Start",
            duration: "70% (32.54s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "32.94s"
              },
              {
                rep: "1",
                time: "32.68s"
              },
              {
                rep: "2",
                time: "32.52s"
              },
              {
                rep: "3",
                time: "32.54s"
              },
              {
                rep: "4",
                time: "33.03s"
              }
            ]
          },
          {
            id: 2,
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          }
        ]
      },
      {
        id: 5,
        name: "Hypertrophy Weight Training",
        details: "105 mins, gym",
        day: "Saturday",
        completed: "false",
        session: [
          {
            id: 0,
            name: "Split Squats or Walking Lunge",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 1,
            name: "Single Legged RDL",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 2,
            name: "Single Legged Calf Raise",
            details: "20% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 3,
            name: "Hamstring Curls",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 4,
            name: "Dumbell Bench Press",
            details: "30% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 5,
            name: "Dumbell Rows",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 6,
            name: "Dumbell Strict Press",
            details: "50% of bodyweight",
            duration: "10 Reps 5 Sets",
            timed: "false"
          },
          {
            id: 7,
            name: "Pull Ups",
            details: "Chin to bar and full extension at the bottom",
            duration: "As many as possible",
            timed: "false"
          }
        ]
      },
      {
        id: "6",
        name: "Rest",
        details: "Complete Rest",
        day: "Sunday",
        completed: "false",
        session: [
          {
            id: 0,
            name: "Rest",
            details: "Complete Rest",
            duration: "24h",
            timed: "false"
          }
        ]
      }
    ]
  },
  {
    id: "1",
    name: "Week 2 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "2",
    name: "Week 3 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "3",
    name: "Week 4 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "4",
    name: "Week 5 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "5",
    name: "Week 6 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "6",
    name: "Week 7 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  },
  {
    id: "7",
    name: "Week 8 Offseason",
    completed: "true",
    sessions: [
      {
        id: "0",
        name: "Rehab Focus and Deep Stretch",
        details: "45 mins, home or gym",
        day: "Monday",
        completed: "true",
        session: [
          {
          }
        ]
      },
      {
        id: "1",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Tuesday",
        completed: "true",
        session: []
      },
      {
        id: "2",
        name: "Acceleration and Plyometrics",
        details: "45 mins, track",
        day: "Wednesday",
        completed: "false",
        session: [
          {
            id: "0",
            name: "Warm up",
            details: "A Skips, B Skips, C Skips, 2 Strides",
            duration: "15m",
            timed: "false"
          },
          {
            id: "1",
            name: "Plyometrics",
            details: "RRLL Bounds, Triple Broad Jump, Box Jump, Depth Jump",
            duration: "3 Sets",
            timed: "false"
          },
          {
            id: "2",
            name: "Acceleration",
            details: "6 x 30m Three-Point Start",
            duration: "95% (4.16s)",
            timed: "true",
            times: [
              {
                rep: "0",
                time: "4.11s"
              },
              {
                rep: "1",
                time: "4.09s"
              },
              {
                rep: "2",
                time: "4.05s"
              },
              {
                rep: "3",
                time: "4.07s"
              },
              {
                rep: "4",
                time: "4.15s"
              },
              {
                rep: "5",
                time: "0.00s"
              }
            ]
          },
          {
            id: "3",
            name: "Warm down",
            details: "Pigeon Stretch, Lunge Stretch, Quad Stretch, Calf Stretch",
            duration: "15m",
            timed: "false"
          },
        ]
      },
      {
        id: "3",
        name: "Endurance and Core",
        details: "45 mins, home or gym",
        day: "Thursday",
        completed: "false",
        session: []
      },
      {
        id: "4",
        name: "Active Recovery",
        details: "Aim for 10k steps",
        day: "Friday",
        completed: "false",
        session: []
      },
      {
        id: "5",
        name: "Power",
        details: "105 mins, track",
        day: "Saturday",
        completed: "false",
        session: []
      },
      {
        id: "6",
        name: "Strength",
        details: "60 mins, gym",
        day: "Sunday",
        completed: "false",
        session: []
      }
    ]
  }
]

export default localData