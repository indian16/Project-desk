import React, { useState, useEffect, useRef } from "react";
import { getAvailableYears } from "../../services/headService";
import {
  uploadProjectBank,
  uploadStudentList,
  uploadMentorList,
} from "../../services/headService";
import { 
  CloudUpload, 
  Database, 
  Users, 
  UserCheck, 
  Calendar, 
  Loader2,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";

const Uploads = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeUpload, setActiveUpload] = useState(""); // To show which card is loading

  const projectBankRef = useRef(null);
  const studentListRef = useRef(null);
  const mentorListRef = useRef(null);

  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      try {
        const data = await getAvailableYears();
        setAvailableYears(data);
        if (data.length > 0) setAcademicYear(data[0].year);
      } catch (err) {
        console.error("Error fetching academic years:", err);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, []);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setActiveUpload(type);

    try {
      if (type === "projectBank") await uploadProjectBank(file, academicYear);
      else if (type === "studentList") await uploadStudentList(file, academicYear);
      else if (type === "mentorList") await uploadMentorList(file, academicYear);

      alert(`${type} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload ${type}.`);
    } finally {
      setUploading(false);
      setActiveUpload("");
      if (type === "projectBank") projectBankRef.current.value = "";
      else if (type === "studentList") studentListRef.current.value = "";
      else if (type === "mentorList") mentorListRef.current.value = "";
    }
  };

  const uploadSections = [
    {
      id: "projectBank",
      title: "Project Bank",
      icon: <Database className="text-indigo-600" />,
      ref: projectBankRef,
      description: "Excel containing project titles and descriptions."
    },
    {
      id: "studentList",
      title: "Student Roster",
      icon: <Users className="text-emerald-600" />,
      ref: studentListRef,
      description: "Master list of eligible students for allocation."
    },
    {
      id: "mentorList",
      title: "Mentor List",
      icon: <UserCheck className="text-amber-600" />,
      ref: mentorListRef,
      description: "List of faculty mentors and specializations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-2 lg:p-10 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
              <CloudUpload className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data <span className="text-indigo-600">Ingestion</span></h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Management Portal / Uploads</p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm min-w-[280px]">
            <Calendar className="text-slate-400" size={24} />
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Academic Session</label>
              {loadingYears ? (
                <div className="h-4 w-20 bg-slate-100 animate-pulse rounded mt-1"></div>
              ) : (
                <select 
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none text-sm cursor-pointer"
                >
                  {availableYears.map((y) => (
                    <option key={y._id} value={y.year}>{y.year}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* --- UPLOAD CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {uploadSections.map((section) => (
            <div 
              key={section.id}
              className="group bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Card Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
              
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(section.icon, { size: 36 })}
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">{section.title}</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-4">
                {section.description}
              </p>

              <div className="mt-auto w-full">
                <input
                  ref={section.ref}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, section.id)}
                  disabled={uploading}
                  className="hidden"
                />
                
                <button
                  onClick={() => section.ref.current.click()}
                  disabled={uploading}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                    ${activeUpload === section.id 
                      ? 'bg-slate-900 text-white shadow-xl translate-y-1' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white shadow-md'
                    } disabled:opacity-50`}
                >
                  {activeUpload === section.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <FileSpreadsheet size={18} />
                  )}
                  {activeUpload === section.id ? "Processing..." : "Select Excel"}
                </button>
              </div>

              {/* Status Indicator */}
              {activeUpload === section.id && (
                <div className="absolute top-6 right-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- FOOTER INFO --- */}
        <div className="mt-12 bg-white rounded-[2rem] p-6 border-2 border-slate-100 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg">!</div>
            <p className="text-slate-600 font-bold text-sm tracking-tight italic">
              System strictly accepts <span className="text-indigo-600 font-black">.xlsx</span> or <span className="text-indigo-600 font-black">.xls</span> files only.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-300">
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Upload</span>
            <ArrowRight size={14} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Uploads;