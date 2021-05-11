const mongoose = require("mongoose")
const createServer = require("./server")
const Workout = mongoose.model('Workout');
const supertest = require("supertest");

const testMongoURI = "mongodb+srv://admin:passwordpassword@cluster0.cfznd.mongodb.net/test?retryWrites=true&w=majority";

beforeEach((done) => {
	mongoose.connect(
		testMongoURI,
		{ useNewUrlParser: true },
		() => done()
	)
})

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})

const app = createServer();

test("GET /workout", async () => {
  // Save the workout
  const workoutTitle = "Leg day"
  const exercises = [{ 
    title: "Squats",
    duration: 60,
    description: "Ow my legs hurt",
    image: "bufflegs.png"
   }]
   
  const workout = new Workout({ workoutTitle, exercises });
    await workout.save();

	await supertest(app)
		.get("/workout")
		.expect(200)
		.then((res) => {
      console.log(res.body[0])
      
      // Check the response type and length
      expect(res.body.length).toEqual(1)
      // Checking the exercises
      
			// expect(exercises.length).toEqual(1)
      // expect(exercises[0].title).toEqual("Squats")
      // expect(exercises[0].duration).toEqual(60)
      // expect(exercises[0].description).toEqual("Ow my legs hurt")
      // expect(exercises[0].image).toEqual("bufflegs.png")
			// Check the workoutTitle
      expect(res.body[0].workoutTitle).toEqual(workout.workoutTitle)
		})
})