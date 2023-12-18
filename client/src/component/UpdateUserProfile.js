import React, { useState, useEffect, useRef, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar/Avatar";
import {
  uploadToCloudinary,
  uploadToCloudinaryV2,
} from "../utility/cloudinary";
import { Loader } from "./Loader/Loader";
import { TextEditor } from "./TextEditor/TextEditor";
import { TextArea } from "./TextArea/TextArea";
import { languagesData, languageFluencyLevelData } from "../data/languages";
import { countryList } from "../data/countries";
import SelectInput2 from "./SelectInput/SelectInput2";
import { BiColorFill, BiTrash } from "react-icons/bi";
import { skillLevels } from "../data/skills";
import { axiosInstance } from "../utility/axiosInstance";

const yearsList = [];
for (let i = new Date().getFullYear(); i >= 1960; i--) {
  yearsList.push(i.toString());
}

export const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    avatar: {
      publicId: "",
      url: "",
    },
    tagline: "",
    description: "",
    languages: [],
    education: [],
    certificates: [],
    skills: [],
  });

  const [imageLoading, setImageLoading] = useState(false);

  const SELECT_LANGUAGE = "Select language";
  const SELECT_FLUENCY_LEVEL = "Select fluency level";
  const SELECT_COUNTRY = "Select country";
  const YEAR_OF_GRADUATION = "Year of graduation";
  const YEAR_OF_CERTIFICATION = "Year";
  const SELECT_SKILL_LEVEL = "Experience level";

  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const currLanguageRef = useRef(null);
  const currLanguageFluencyLevelRef = useRef(null);
  const countryRef = useRef(null);
  const collegeRef = useRef(null);
  const degreeTitleRef = useRef(null);
  const degreeMajorRef = useRef(null);
  const yearOfGraduationRef = useRef(null);
  const certificationTitleRef = useRef(null);
  const certificationAuthorityRef = useRef(null);
  const certificationYearRef = useRef(null);
  const skillTitleRef = useRef(null);
  const skillLevelRef = useRef(null);

  const [openEducationAdder, setOpenEducationAdder] = useState(false);
  const [openCertificationAdder, setOpenCertificationAdder] = useState(false);
  const [openLanguageAdder, setOpenLanguageAdder] = useState(false);
  const [openSkillsAdder, setOpenSkillsAdder] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
    else{
      setFormData({
        avatar: {
          publicId: user?.avatar?.publicId,
          url: user?.avatar?.url,
        },
        tagline: user?.tagline,
        description: user?.description,
        languages: user?.languages,
        education: user?.education,
        certificates: user?.certificates,
        skills: user?.skills,
      });
      taglineRef.current.value = user?.tagline;
      descriptionRef.current.setTextComingFromParent(user?.description);
    }
  }, [isAuthenticated, user]);

  const handleAvatarChange = async (e) => {
    try {
      if (!e.target.files[0]) return;
      setImageLoading(true);
      const arr = [e.target.files[0]];
      const res = await uploadToCloudinaryV2(arr);
      setFormData({
        ...formData,
        avatar: {
          url: res[0].url,
          publicId: "mypublicId",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {...formData, tagline: taglineRef.current.value, description: descriptionRef.current.currValue}
    try {
      const {data} = await axiosInstance.put("/user/update", payload);  
      console.log(data.user);
      dispatch({type: "UPDATE_USER_SUCCESS", payload: data.user});
      navigate(`/user/${data.user._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrLanguageChange = (val) => {
    currLanguageFluencyLevelRef.current.setChoosedOptionComingFromParent(
      SELECT_FLUENCY_LEVEL
    );
  };

  const handleAddLanguage = () => {
    const currLanguage = currLanguageRef.current.currValue;
    const currLanguageFluencyLevel =
      currLanguageFluencyLevelRef.current.currValue;
    if (
      currLanguage.toLowerCase() === SELECT_LANGUAGE.toLowerCase() ||
      currLanguageFluencyLevel.toLowerCase() ===
        SELECT_FLUENCY_LEVEL.toLowerCase()
    )
      return;
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        {
          name: currLanguage,
          level: currLanguageFluencyLevel,
        },
      ],
    });

    currLanguageRef.current.setChoosedOptionComingFromParent(SELECT_LANGUAGE);
    currLanguageFluencyLevelRef.current.setChoosedOptionComingFromParent(
      "Select fluency level"
    );
    setOpenLanguageAdder(false);
  };

  const handleCancelLanguage = (index) => {
    currLanguageRef.current.setChoosedOptionComingFromParent(SELECT_LANGUAGE);
    currLanguageFluencyLevelRef.current.setChoosedOptionComingFromParent(
      "Select fluency level"
    );
    setOpenLanguageAdder(false);
  };

  const handleRemoveLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const handleAddEducation = () => {
    const country = countryRef.current.currValue;
    const collegeName = collegeRef.current.value;
    const degree = degreeTitleRef.current.value;
    const major = degreeMajorRef.current.value;
    const yearOfGraduation = yearOfGraduationRef.current.currValue;

    if (
      country === SELECT_COUNTRY ||
      !collegeName ||
      !degree ||
      !major ||
      yearOfGraduation === YEAR_OF_GRADUATION
    ) {
      return;
    }

    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          country,
          collegeName,
          degree,
          major,
          yearOfGraduation,
        },
      ],
    });

    countryRef.current.setChoosedOptionComingFromParent(SELECT_COUNTRY);
    collegeRef.current.value = "";
    degreeTitleRef.current.value = "";
    degreeMajorRef.current.value = "";
    yearOfGraduationRef.current.setChoosedOptionComingFromParent(
      YEAR_OF_GRADUATION
    );

    setOpenEducationAdder(false);
  };

  const handleCancelEducation = () => {
    countryRef.current.setChoosedOptionComingFromParent(SELECT_COUNTRY);
    collegeRef.current.value = "";
    degreeTitleRef.current.value = "";
    degreeMajorRef.current.value = "";
    yearOfGraduationRef.current.setChoosedOptionComingFromParent(
      YEAR_OF_GRADUATION
    );
    setOpenEducationAdder(false);
  };

  const handleRemoveEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleAddCertification = () => {
    const name = certificationTitleRef.current.value;
    const certifiedFrom = certificationAuthorityRef.current.value;
    const year = certificationYearRef.current.currValue;
    if (!name || !certifiedFrom || year === YEAR_OF_CERTIFICATION) {
      return;
    }
    setFormData({
      ...formData,
      certificates: [
        ...formData.certificates,
        {
          name,
          certifiedFrom,
          year,
        },
      ],
    });
    certificationTitleRef.current.value = "";
    certificationAuthorityRef.current.value = "";
    certificationYearRef.current.setChoosedOptionComingFromParent(
      YEAR_OF_CERTIFICATION
    );
    setOpenCertificationAdder(false);
  };

  const handleCancelCertification = () => {
    certificationTitleRef.current.value = "";
    certificationAuthorityRef.current.value = "";
    certificationYearRef.current.setChoosedOptionComingFromParent(
      YEAR_OF_CERTIFICATION
    );
    setOpenCertificationAdder(false);
  };

  const handleRemoveCertification = (index) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index),
    });
  };

  const handleAddSkill = () => {
    const name = skillTitleRef.current.value;
    const level = skillLevelRef.current.currValue;
    if (!name || level === SELECT_SKILL_LEVEL) {
      return;
    }
    setFormData({
      ...formData,
      skills: [
        ...formData.skills,
        {
          name,
          level,
        },
      ],
    });
    skillTitleRef.current.value = "";
    skillLevelRef.current.setChoosedOptionComingFromParent(SELECT_SKILL_LEVEL);
    setOpenSkillsAdder(false);
  };

  const handleCancelSkill = () => {
    skillTitleRef.current.value = "";
    skillLevelRef.current.setChoosedOptionComingFromParent(SELECT_SKILL_LEVEL);
    setOpenSkillsAdder(false);
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    isAuthenticated && (
      <div className="p-8 sm:px-12 md:px-20  md:py-12 lg:px-40 text-dark_grey leading-5">
        <h1 className="text-2xl sm:text-3xl font-semibold">Hi {user.name}</h1>
        <p className="leading-5 text-light_heading mt-2 sm:mt-4">
          Please fill out the below form to update your profile.
        </p>
        <form
          className="mt-8 md:max-w-xl flex flex-col gap-8"
          onSubmit={handleFormSubmit}
        >
          {/* profile picture */}
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 relative">
              {formData.avatar.url ? (
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={formData.avatar.url}
                  alt="profile"
                  onLoad={() => setImageLoading(false)}
                />
              ) : (
                <img
                  className="object-cover w-full h-full rounded-full"
                  src="/images/avatar.avif"
                />
              )}
              {imageLoading && (
                <div className="absolute top-0 left-0 flex items-center justify-center rounded-full  w-full h-full bg-black opacity-50">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 mr-2  animate-spin text-white fill-black"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            <label className="bg-icons py-2 px-4 rounded text-white hover:cursor-pointer">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* tagline */}
          <div>
            <label className="text-lg font-semibold mb-2">Tagline</label>
            <input
              maxLength={60}
              type="text"
              onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}
              className="outline-none w-full py-2 px-4 text-light_heading rounded border border-no_focus focus:outline-none focus:border-light_grey"
              ref={taglineRef}
            />
          </div>

          {/* description */}
          <div>
            <label className="text-lg font-semibold mb-2">Description</label>
            <TextArea
              maxLength={600}
              placeholder="Enter your description"
              style={{ height: "200px", lineHeight: "1.5", color: "#4B5563" }}
              ref={descriptionRef}
            />
          </div>

          {/* languages */}
          <div className="-mt-4">
            <div className="flex items-center gap-12 mb-2">
              <label className="text-lg font-semibold">Languages</label>
              <p
                onClick={() => setOpenLanguageAdder(true)}
                className="text-blue-600 hover:underline hover:cursor-pointer"
              >
                Add New
              </p>
            </div>
            {formData.languages.length === 0 && !openLanguageAdder && (
              <p className="text-light_heading">Add language</p>
            )}
            {formData.languages.length < 4 && openLanguageAdder && (
              <div className="">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  <SelectInput2
                    data={languagesData}
                    placeholder={SELECT_LANGUAGE}
                    defaultOption={SELECT_LANGUAGE}
                    getChoosenOption={handleCurrLanguageChange}
                    ref={currLanguageRef}
                    style={{ borderRadius: "2px" }}
                  />
                  <SelectInput2
                    data={languageFluencyLevelData}
                    placeholder={SELECT_FLUENCY_LEVEL}
                    defaultOption={SELECT_FLUENCY_LEVEL}
                    ref={currLanguageFluencyLevelRef}
                    style={{ borderRadius: "2px" }}
                  />
                </div>
                <div className="flex items-center gap-8 justify-end mt-4">
                  <button
                    onClick={handleCancelLanguage}
                    type="button"
                    className="py-2 hover:cursor-pointer hover:underline rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLanguage}
                    type="button"
                    className="py-2 px-4 hover:cursor-pointer bg-icons text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            <ul className="mt-4 max-w-max">
              {formData.languages.map((lang, index) => (
                <li
                  key={index}
                  className="mb-4 flex gap-4 sm:gap-8 justify-between text-light_heading"
                >
                  <p className="capitalize">
                    {lang.name} - {lang.level}
                  </p>
                  <p
                    className="hover:text-warning hover:cursor-pointer"
                    onClick={() => handleRemoveLanguage(index)}
                  >
                    <BiTrash />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* education  */}
          <div>
            <div className="flex items-center gap-12 mb-2">
              <label className="text-lg font-semibold">Education</label>
              <p
                onClick={() => setOpenEducationAdder(true)}
                className="text-blue-600 hover:underline hover:cursor-pointer"
              >
                Add New
              </p>
            </div>

            {formData.education.length == 0 && !openEducationAdder && (
              <p className="text-light_heading">Add your education</p>
            )}

            {formData.education.length < 6 && openEducationAdder && (
              <div>
                <div className="flex flex-col gap-4">
                  <SelectInput2
                    data={countryList}
                    placeholder="Select Country"
                    defaultOption={SELECT_COUNTRY}
                    style={{ borderRadius: "2px" }}
                    ref={countryRef}
                  />
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full py-2 px-4 text-light_heading rounded-sm border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="College/University name"
                    ref={collegeRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full rounded-sm py-2 px-4 text-light_heading border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="Title"
                    ref={degreeTitleRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full rounded-sm py-2 px-4 text-light_heading border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="Major"
                    ref={degreeMajorRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <SelectInput2
                    data={yearsList}
                    defaultOption={YEAR_OF_GRADUATION}
                    style={{ borderRadius: "2px" }}
                    ref={yearOfGraduationRef}
                  />
                </div>
                <div className="flex items-center gap-8 justify-end mt-4">
                  <button
                    onClick={handleCancelEducation}
                    type="button"
                    className="py-2 hover:cursor-pointer hover:underline rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEducation}
                    type="button"
                    className="py-2 px-4 hover:cursor-pointer bg-icons text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <ul className="mt-4 max-w-max">
              {formData.education.map((edu, index) => (
                <li
                  key={index}
                  className="mb-4 flex justify-between gap-4 sm:gap-8 text-light_heading"
                >
                  <div>
                    <p className="capitalize">
                      {edu.degree} - {edu.major}
                    </p>
                    <p className="text-icons mt-2 leading-5">
                      {edu.collegeName}, {edu.country}, Graduated{" "}
                      {edu.yearOfGraduation}
                    </p>
                  </div>
                  <p
                    className="hover:text-warning hover:cursor-pointer"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <BiTrash />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* certification  */}
          <div>
            <div className="flex items-center gap-12 mb-2">
              <label className="text-lg font-semibold">Certification</label>
              <p
                onClick={() => setOpenCertificationAdder(true)}
                className="text-blue-600 hover:underline hover:cursor-pointer"
              >
                Add New
              </p>
            </div>

            {formData.certificates.length == 0 && !openCertificationAdder && (
              <p className="text-light_heading">Add your certification</p>
            )}

            {formData.certificates.length < 6 && openCertificationAdder && (
              <div>
                <div className="flex flex-col gap-4">
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full py-2 px-4 text-light_heading rounded-sm border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="Certificate Or Award"
                    ref={certificationTitleRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full rounded-sm py-2 px-4 text-light_heading border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="Certified from (e.g. Google)"
                    ref={certificationAuthorityRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <SelectInput2
                    data={yearsList}
                    defaultOption={YEAR_OF_CERTIFICATION}
                    style={{ borderRadius: "2px" }}
                    ref={certificationYearRef}
                  />
                </div>
                <div className="flex items-center gap-8 justify-end mt-4">
                  <button
                    onClick={handleCancelCertification}
                    type="button"
                    className="py-2 hover:cursor-pointer hover:underline rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCertification}
                    type="button"
                    className="py-2 px-4 hover:cursor-pointer bg-icons text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <ul className="mt-4 max-w-max">
              {formData.certificates.map((certificate, index) => (
                <li
                  key={index}
                  className="mb-4 flex justify-between gap-8  text-light_heading"
                >
                  <div>
                    <p className="capitalize">{certificate.name}</p>
                    <p className="text-icons mt-2">
                      {certificate.certifiedFrom}, {certificate.year}
                    </p>
                  </div>
                  <p
                    className="hover:text-warning hover:cursor-pointer"
                    onClick={() => handleRemoveCertification(index)}
                  >
                    <BiTrash />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* skills  */}
          <div>
            <div className="flex items-center gap-12 mb-2">
              <label className="text-lg font-semibold">Skill</label>
              <p
                onClick={() => setOpenSkillsAdder(true)}
                className="text-blue-600 hover:underline hover:cursor-pointer"
              >
                Add New
              </p>
            </div>

            {formData.skills.length == 0 && !openSkillsAdder && (
              <p className="text-light_heading">Add your skill</p>
            )}

            {formData.skills.length < 6 && openSkillsAdder && (
              <div>
                <div className="flex flex-col gap-4">
                  <input
                    className="placeholder:text-icons text-sm outline-none w-full py-2 px-4 text-light_heading rounded-sm border border-no_focus focus:outline-none focus:border-light_grey"
                    placeholder="Add Skill (e.g. Graphic Design)"
                    ref={skillTitleRef}
                    onKeyDown={(e) => {e.key === "Enter" && e.preventDefault()}}

                  />
                  <SelectInput2
                    data={skillLevels}
                    defaultOption={SELECT_SKILL_LEVEL}
                    style={{ borderRadius: "2px" }}
                    ref={skillLevelRef}
                  />
                </div>
                <div className="flex items-center gap-8 justify-end mt-4">
                  <button
                    onClick={handleCancelSkill}
                    type="button"
                    className="py-2 hover:cursor-pointer hover:underline rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSkill}
                    type="button"
                    className="py-2 px-4 hover:cursor-pointer bg-icons text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <ul className="mt-4 max-w-max">
              {formData.skills.map((skill, index) => (
                <li
                  key={index}
                  className="mb-4 flex justify-between gap-8  text-light_heading"
                >
                  <div>
                    <p className="capitalize">{skill.name}</p>
                    <p className="text-icons capitalize mt-2">{skill.level}</p>
                  </div>
                  <p
                    className="hover:text-warning hover:cursor-pointer"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    <BiTrash />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <button className="bg-primary text-white px-8 py-3 rounded hover:cursor-pointer hover:bg-primary_hover">
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  );
};
