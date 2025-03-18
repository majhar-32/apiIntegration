import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom"; // Import useParams
import "./App.css";

// Component for listing courses
function CourseList({ courses, handleEdit, handleDelete, handleCreate }) {
  return (
    <div className="course-list">
      <h2>Courses</h2>
      <ul>
        {courses.length === 0 ? (
          <li>Loading...</li>
        ) : (
          courses.map((course) => (
            <li key={course.id} className="course-item">
              <h3>{course.course_name}</h3>
              <p>
                <strong>Teacher:</strong> {course.teacher_name}
              </p>
              <p>
                <strong>Duration:</strong> {course.course_duration} months
              </p>
              <p>
                <strong>Seats Available:</strong> {course.seats}
              </p>

              <button onClick={() => handleEdit(course)}>Edit</button>
              <button onClick={() => handleDelete(course.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
      <button className="create-button" onClick={handleCreate}>
        Create New Course
      </button>
    </div>
  );
}

// Component for adding or editing a course
function CourseForm({ handleSubmit }) {
  const { id } = useParams(); // Get the course id from URL
  const [formData, setFormData] = useState({
    teacher_name: "",
    course_name: "",
    course_duration: "",
    seats: "",
  });

  // Fetch course data when editing (if id exists in URL)
  useEffect(() => {
    if (id) {
      console.log("Editing course with id:", id);
      const fetchCourse = async () => {
        const response = await fetch(`http://127.0.0.1:8000/aiInfo/${id}/`);
        const data = await response.json();
        setFormData({
          teacher_name: data.teacher_name,
          course_name: data.course_name,
          course_duration: data.course_duration,
          seats: data.seats,
          id: data.id,
        });
      };
      fetchCourse();
    }
  }, [id]); // Fetch course data when id changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>{id ? "Update Course" : "Add a Course"}</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        <div>
          <label>Teacher Name:</label>
          <input
            type="text"
            name="teacher_name"
            value={formData.teacher_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Course Duration (Months):</label>
          <input
            type="number"
            name="course_duration"
            value={formData.course_duration}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Seats Available:</label>
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{id ? "Update Course" : "Add Course"}</button>
      </form>
    </div>
  );
}

function App() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // Navigate hook for programmatic navigation

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/aiInfo/");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    navigate(`/edit/${course.id}`);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/aicreate/${id}/`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchCourses();
    }
  };

  const handleCreate = () => {
    navigate("/create");
  };

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    // Check if there is an ID, if so, perform PUT to update the existing course
    console.log(formData.id);
    if (formData.id) {
      console.log(
        "Sending PUT request to:",
        `http://127.0.0.1:8000/aicreate/${formData.id}/`
      );
      const response = await fetch(
        `http://127.0.0.1:8000/aicreate/${formData.id}/`,
        {
          method: "PUT", // Using PUT to update the existing course
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchCourses(); // Fetch the updated courses list
        navigate("/"); // Navigate back to the main page
      }
    } else {
      // If there's no ID, create a new course, use POST
      const response = await fetch("http://127.0.0.1:8000/aicreate/", {
        method: "POST", // POST method to create a new course
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchCourses(); // Fetch the updated courses list
        navigate("/"); // Navigate back to the main page
      } else {
        console.log("POST request failed with status:", response.status);
      }
    }
  };

  const reversedCourses = [...courses].reverse();

  return (
    <div className="App">
      <h1>Courses List</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CourseList
                courses={reversedCourses}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}
              />
            </>
          }
        />
        <Route
          path="/edit/:id"
          element={<CourseForm handleSubmit={handleFormSubmit} />}
        />
        <Route
          path="/create"
          element={<CourseForm handleSubmit={handleFormSubmit} />}
        />
      </Routes>
    </div>
  );
}

export default App;
