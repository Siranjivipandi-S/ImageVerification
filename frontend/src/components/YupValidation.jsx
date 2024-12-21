import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

function YupValidation() {
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("User ID is required"),
    file1: Yup.mixed().required("File 1 is required"),
    file2: Yup.mixed().required("File 2 is required"),
    file3: Yup.mixed().required("File 3 is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append userId
      formData.append("userId", data.userId);

      // Append files
      formData.append("file1", data.file1[0]);
      formData.append("file2", data.file2[0]);
      formData.append("file3", data.file3[0]);

      const response = await axios.post(
        "http://127.0.0.1:8000/uploadImages", // Ensure the correct port
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>User ID</label>
          <input
            name="userId"
            type="text"
            {...register("userId")}
            className={`form-control ${errors.userId ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.userId?.message}</div>
        </div>
        <div className="form-group">
          <label>File 1</label>
          <input
            name="file1"
            type="file"
            {...register("file1")}
            className={`form-control ${errors.file1 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.file1?.message}</div>
        </div>
        <div className="form-group">
          <label>File 2</label>
          <input
            name="file2"
            type="file"
            {...register("file2")}
            className={`form-control ${errors.file2 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.file2?.message}</div>
        </div>
        <div className="form-group">
          <label>File 3</label>
          <input
            name="file3"
            type="file"
            {...register("file3")}
            className={`form-control ${errors.file3 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.file3?.message}</div>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Upload Files
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default YupValidation;
