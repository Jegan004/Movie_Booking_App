import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  Input,
  TextArea,
  Button,
  Label,
  GenreContainer,
  GenreButton,
  ImageLabel,
  PreviewImage,
  Select,
  ImageInput,
  ImageUploadContainer,
} from "../styles/ManageMovieStyles";

const genreOptions = ["Action", "Drama", "Comedy", "Adventure", "Romantic"];
const statusOptions = ["Upcoming", "Now Showing"];

const ManageMovies: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
maxDate.setDate(new Date().getDate() + 10);
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     //console.log("Submit button clicked!");

//     if (!title || !description || !selectedGenre || !releaseDate || !status || !image) {
//         alert("Please fill in all fields and upload an image.");
//         return;
//     }

//     if (releaseDate < today) {
//         alert("Release date cannot be in the past.");
//         return;
//     }

//     const releaseDateUTC = new Date(releaseDate).toISOString();

//     const movieData = {
//         Title: title,
//         Description: description,
//         ReleaseDate: releaseDateUTC,
//         Status: status,
//         Genres: [{ Name: selectedGenre }], 
//         ImageUrl: image, 
//     };

//     //console.log("Submitting JSON Data:", movieData);

//     setLoading(true);

//     try {
//         const response = await axios.post("http://localhost:5233/api/Movie", movieData, {
//             headers: { "Content-Type": "application/json" }, 
//         });

//        // console.log("API Response:", response.data);

//         if (response.status === 201 || response.status === 200) {
//             alert("Movie added successfully!");
//             setTitle("");
//             setDescription("");
//             setSelectedGenre("");
//             setReleaseDate("");
//             setStatus("Upcoming");
//             setImage("");
//         } else {
//             alert("Unexpected response. Check backend.");
//         }
//     } catch (error: any) {
//         console.error("API Error:", error);
//         alert(error.response?.data?.message || "Failed to add movie. Check console.");
//     } finally {
//         setLoading(false);
//     }
// };
  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !description || !selectedGenre || !releaseDate || !status || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
  }

  if (!(image instanceof File)) {
      alert("Please upload a valid image file.");
      return;
  }

  const formData = new FormData();
  formData.append("Title", title);
  formData.append("Description", description);
  formData.append("ReleaseDate", releaseDate);
  formData.append("Status", status);
  formData.append("Genres", selectedGenre); 
  formData.append("ImageFile", image); 

  setLoading(true);

  try {
      const response = await axios.post("http://localhost:5233/api/Movie", formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
          alert("Movie added successfully!");
          setTitle("");
          setDescription("");
          setSelectedGenre("");
          setReleaseDate("");
          setStatus("Upcoming");
          setImage(null);
      } else {
          alert("Unexpected response. Check backend.");
      }
  } catch (error: any) {
      console.error("API Error:", error);
      alert(error.response?.data?.message || "Failed to add movie.");
  } finally {
      setLoading(false);
  }
};

// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files && e.target.files.length > 0) {
//       setImage(e.target.files[0]); // Store the actual file
//   }
// };
const [imageBase64, setImageBase64] = useState<string>("");

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
      setImage(file);
    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageBase64(base64String);
    };
  }
};



  return (
    <FormContainer onSubmit={handleSubmit} data-testid="manage-movie-form">
      <Label data-testid="label">Title:</Label>
      <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} data-testid="text" required />

      <Label data-testid="description">Description:</Label>
      <TextArea value={description} onChange={(e) => setDescription(e.target.value)} data-testid="movie-description"required />

      <Label data-testid="release">Release Date:</Label>
      <Input type="date" value={releaseDate} min={today} max={maxDate.toISOString().split("T")[0]} onChange={(e) => setReleaseDate(e.target.value)} data-testid="date" required />

      <Label data-testid="status">Status:</Label>
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>

      <Label data-testid="Genre">Genre:</Label>
      <GenreContainer>
        {genreOptions.map((genre) => (
          <GenreButton
            key={genre}
            selected={selectedGenre === genre}
            type="button"
            onClick={() => setSelectedGenre(genre)}
            data-testid={`genre-${genre.toLowerCase()}`}
          >
            {genre}
            
          </GenreButton>
        ))}
      </GenreContainer>
      <ImageUploadContainer>
      <ImageLabel>Choose Image<ImageInput 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange}
        />
      </ImageLabel>

      {image && (
    <PreviewImage src={URL.createObjectURL(image)} alt="Preview" />)}
    </ImageUploadContainer>

        <Label></Label>
      <Button type="submit" onClick={handleSubmit} disabled={loading} data-testid="button">
        {loading ? "Adding..." : "Add Movie"}
      </Button>
    </FormContainer>
  );
};

export default ManageMovies;
