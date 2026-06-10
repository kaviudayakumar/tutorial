import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { requestPresignedUrl, uploadFileToS3, confirmUpload } from "../services/api";

export default function FormToFileUpload() {

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        type: "success" | "error" | "uploading" | "idle";
        message: string;
    }>({ type: "idle", message: "" });

    const fileInputRef = useRef<HTMLInputElement>(null);



    // Pick file type from .env (Vite standard)
    const configFileType = import.meta.env.VITE_FILE_UPLOAD_TYPE || "pdf";

    // Normalize the accept attribute value:
    // e.g. "pdf" -> ".pdf", "image/*" -> "image/*", "application/pdf" -> "application/pdf"
    const acceptAttribute = configFileType.startsWith(".") || configFileType.includes("/")
        ? configFileType
        : `.${configFileType}`;

    // Check file type matches the .env configuration
    const validateFileType = (selectedFile: File): boolean => {
        const fileName = selectedFile.name.toLowerCase();
        const fileType = selectedFile.type.toLowerCase();
        const rule = configFileType.toLowerCase();

        if (rule.endsWith("/*")) {
            // Handles e.g. "image/*", "audio/*"
            const category = rule.split("/")[0];
            return fileType.startsWith(`${category}/`);
        } else if (rule.includes("/")) {
            // Handles precise MIME types, e.g. "application/pdf"
            return fileType === rule;
        } else {
            // Handles extension suffixes, e.g. ".pdf" or "pdf"
            const suffix = rule.startsWith(".") ? rule : `.${rule}`;
            return fileName.endsWith(suffix);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (validateFileType(selectedFile)) {
            setFile(selectedFile);
            setUploadStatus({ type: "idle", message: "" });
        } else {
            setFile(null);
            setUploadStatus({
                type: "error",
                message: `Invalid file type. Configured accepted file type is: ${configFileType.toUpperCase()}`,
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setUploadStatus({
                type: "error",
                message: "Please select or drop a file before uploading.",
            });
            return;
        }

        setUploadStatus({ type: "uploading", message: "Requesting S3 pre-signed URL..." });

        try {
            // 1. Get pre-signed URL and file key from the API Gateway / Microservice
            const mimeType = file.type || "application/octet-stream";
            const presignedRes = await requestPresignedUrl(file.name, mimeType);
            
            if (!presignedRes.success || !presignedRes.url || !presignedRes.fileKey) {
                throw new Error("Invalid pre-signed URL response from server.");
            }

            // 2. Upload the file binary directly to AWS S3 using the pre-signed URL
            setUploadStatus({ type: "uploading", message: "Uploading binary file to AWS S3..." });
            await uploadFileToS3(presignedRes.url, file, mimeType);

            // 3. Confirm the upload completion to the microservice backend
            setUploadStatus({ type: "uploading", message: "Registering upload confirmation..." });
            const confirmRes = await confirmUpload(file.name, presignedRes.fileKey, mimeType, file.size);

            if (confirmRes.success) {
                setUploadStatus({
                    type: "success",
                    message: `Successfully uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)!`,
                });
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                throw new Error("Upload confirmation was not acknowledged by the server.");
            }
        } catch (error: any) {
            console.error("Upload workflow failure:", error);
            const errorMsg = error.response?.data?.message || error.message || "An error occurred during S3 upload.";
            setUploadStatus({
                type: "error",
                message: `Upload failed: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`,
            });
        }
    };

    const clearSelection = () => {
        setFile(null);
        setUploadStatus({ type: "idle", message: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Human-readable format of the expected type for display:
    const displayExpectedType = configFileType.startsWith(".")
        ? configFileType.slice(1).toUpperCase()
        : configFileType.toUpperCase();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </Link>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
                <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 mb-2">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Form File Upload
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Upload files matching the environment configuration. Current restriction:{" "}
                        <span className="font-semibold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40">
                            {displayExpectedType}
                        </span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] cursor-pointer ${dragActive
                                ? "border-violet-500 bg-violet-500/5 dark:bg-violet-500/10 scale-[0.99] shadow-md shadow-violet-500/5"
                                : "border-slate-300 dark:border-slate-800 hover:border-violet-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                            }`}
                        onClick={onButtonClick}
                    >
                        <input
                            ref={fileInputRef}
                            id="file"
                            type="file"
                            accept={acceptAttribute}
                            onChange={handleChange}
                            className="hidden"
                        />

                        {!file ? (
                            <div className="space-y-3 pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                                    <Upload className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Drag & Drop your file here, or <span className="text-violet-600 dark:text-violet-400">browse</span>
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Supports only .{displayExpectedType.toLowerCase()} files
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 rounded-xl relative group/item">
                                    <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="text-left overflow-hidden pr-8">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Feedback Messages */}
                    {uploadStatus.type === "success" && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}

                    {uploadStatus.type === "error" && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}

                    {uploadStatus.type === "uploading" && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm">
                            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}

                    <div className="flex gap-4">
                        {file && uploadStatus.type !== "uploading" && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all duration-200"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={!file || uploadStatus.type === "uploading"}
                            className="flex-2 py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-950/10 hover:shadow-violet-950/25 transition-all duration-250 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {uploadStatus.type === "uploading" ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}