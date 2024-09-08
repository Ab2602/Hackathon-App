import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import "../assets/styles/edit_challenge.css";

const EditDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challengeName, setChallengeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [level, setLevel] = useState("Easy");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`https://hackathon-app-8j8c.vercel.app/api/challenges/${id}`)
        .then(response => response.json())
        .then(data => {
          setChallengeName(data.challengeName);
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          setDesc(data.description);
          setLevel(data.level);
          if (data.image) {
            setImagePreviewUrl(data.image);
          }
        })
        .catch(error => console.error('Error fetching challenge details:', error));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("challengeName", challengeName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("desc", desc);
    formData.append("level", level);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/challenges/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Challenge updated successfully:", result);
        alert("Challenge updated successfully!");
        navigate(`/challenge/${id}`); // Redirect to challenge detail page
      } else {
        console.error("Error updating challenge");
        alert("Failed to update challenge");
      }
    } catch (error) {
      console.error("Error updating challenge:", error);
      alert("Failed to update challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <>
      <div className="nav">
        <img src={Logo} alt="logo" width="7%" />
      </div>
      <div className="form">

      <div className="heading_text">
        <h2>Challenge Details</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-data">
        <label>Challenge Name</label>
        <br />
        <input
          type="text"
          name="challenge"
          id="challenge"
          onChange={(e) => setChallengeName(e.target.value)}
          value={challengeName}
          required
        />
        <br />
        <label>Start Date</label>
        <br />
        <input
          type="date"
          name="start_date"
          placeholder="Add start date"
          id="date-start"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
          required
        />
        <br />
        <label>End Date</label>
        <br />
        <input
          type="date"
          name="end_date"
          id="end_date"
          placeholder="Add end date"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
          required
        />
        <br />
        <label>Description</label>
        <br />
        <textarea
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          rows={10}
          cols={80}
          style={{ resize: "none", margin: "10px 0px" }}
          required
        ></textarea>
        <br />
        <p><strong>Image</strong></p>
        <br />
       
        {imagePreviewUrl && (
          <div>
            <img
              src={imagePreviewUrl}
              alt="Selected"
              style={{ width: "40vh", height: "20vh ", borderRadius:"3vh" }}
            />
          </div>
        )}
         <label htmlFor="imageUpload" className="" style={{color:"green", paddingBottom:"4vh "}}>
          Change Image →
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none", margin: "10px 0px" }}
        />
        <br />
        <label style={{marginTop:"10vh"}}>Level Type</label>
        <br />
        <select
          name="level"
          id="level"
          onChange={(e) => setLevel(e.target.value)}
          value={level}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <br />
        <button type="submit" className="create-btn">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {loading && <div className="loading-overlay">Loading...</div>}
      </div>
    </>
  );
};

export default EditDetails;
