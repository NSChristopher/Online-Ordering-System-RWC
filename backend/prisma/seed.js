// Prisma seed script for workout templates and exercises
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.workoutSet.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutTemplate.deleteMany();
  await prisma.exercise.deleteMany();

  // Seed exercises
  const exercises = await prisma.exercise.createMany({
    data: [
      {
        name: "Bench Press",
        description: "Barbell chest press",
        muscleGroup: "Chest",
      },
      { name: "Squat", description: "Barbell back squat", muscleGroup: "Legs" },
      {
        name: "Deadlift",
        description: "Barbell deadlift",
        muscleGroup: "Back",
      },
      {
        name: "Overhead Press",
        description: "Standing barbell press",
        muscleGroup: "Shoulders",
      },
      {
        name: "Barbell Row",
        description: "Bent-over barbell row",
        muscleGroup: "Back",
      },
      {
        name: "Pull Up",
        description: "Bodyweight pull up",
        muscleGroup: "Back",
      },
      {
        name: "Bicep Curl",
        description: "Dumbbell bicep curl",
        muscleGroup: "Arms",
      },
      {
        name: "Tricep Extension",
        description: "Dumbbell tricep extension",
        muscleGroup: "Arms",
      },
      {
        name: "Leg Press",
        description: "Machine leg press",
        muscleGroup: "Legs",
      },
      {
        name: "Calf Raise",
        description: "Standing calf raise",
        muscleGroup: "Legs",
      },
    ],
  });

  // Fetch exercises for template linking
  const allExercises = await prisma.exercise.findMany();
  const ex = (name) => allExercises.find((e) => e.name === name);

  // Seed workout templates
  const pushTemplate = await prisma.workoutTemplate.create({
    data: {
      name: "Push Day",
      description: "Chest, shoulders, triceps",
      exercises: {
        create: [
          { exerciseId: ex("Bench Press").id, order: 1 },
          { exerciseId: ex("Overhead Press").id, order: 2 },
          { exerciseId: ex("Tricep Extension").id, order: 3 },
        ],
      },
    },
  });

  const pullTemplate = await prisma.workoutTemplate.create({
    data: {
      name: "Pull Day",
      description: "Back, biceps",
      exercises: {
        create: [
          { exerciseId: ex("Barbell Row").id, order: 1 },
          { exerciseId: ex("Pull Up").id, order: 2 },
          { exerciseId: ex("Bicep Curl").id, order: 3 },
        ],
      },
    },
  });

  const legsTemplate = await prisma.workoutTemplate.create({
    data: {
      name: "Leg Day",
      description: "Quads, hamstrings, calves",
      exercises: {
        create: [
          { exerciseId: ex("Squat").id, order: 1 },
          { exerciseId: ex("Leg Press").id, order: 2 },
          { exerciseId: ex("Calf Raise").id, order: 3 },
        ],
      },
    },
  });

  console.log("Seeded workout templates and exercises!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
