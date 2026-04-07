import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArticle } from "../../hooks/useArticlesReader";
import Loading from "../ui/Loading";
import Button from "../ui/Button";
import { ArrowLeft, BookOpen, FileText, File } from "lucide-react";

const ViewArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading } = useArticle(id);

  // 🔥 SCROLL PROGRESS
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollTop / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <Loading />;

  if (!article) {
    return (
      <div className="p-10 text-center text-gray-500">
        Article not found 🚫
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">

      {/* 🔥 SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 🔝 TOP BAR */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b px-6 py-4 flex justify-between items-center shadow-sm">

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Reading Mode</p>
            <h2 className="text-sm font-semibold text-gray-700">
              Article View
            </h2>
          </div>
        </div>

        <Button
          onClick={() => navigate("/teacher/articles")}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* 📄 CONTENT */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-3xl py-12">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900 leading-tight tracking-tight">
            {article?.title}
          </h1>

          {/* CONTENT CARD */}
          <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-3xl shadow-xl p-6 md:p-10 space-y-8">

            {article.contentBlocks?.map((block, i) => {
              switch (block.type) {

                case "text":
                  return (
                    <p key={i} className="text-justify text-lg leading-8 text-gray-700">
                      {block.value}
                    </p>
                  );

                case "image":
                  return (
                    <div key={i} className="flex justify-center">
                      <img
                        src={block.value}
                        alt=""
                        className="rounded-2xl shadow-lg hover:scale-[1.02] transition"
                      />
                    </div>
                  );

                case "video": {
                  const isYoutube =
                    block.value.includes("youtube.com") ||
                    block.value.includes("youtu.be");

                  if (isYoutube) {
                    const videoId =
                      block.value.includes("youtu.be")
                        ? block.value.split("youtu.be/")[1]
                        : block.value.split("v=")[1]?.split("&")[0];

                    return (
                      <div key={i} className="flex justify-center">
                        <iframe
                          className="rounded-2xl shadow-md w-full max-w-3xl h-[400px]"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={i} className="flex justify-center">
                      <video
                        controls
                        className="rounded-2xl shadow-md max-h-[500px] w-full"
                      >
                        <source src={block.value} type="video/mp4" />
                      </video>
                    </div>
                  );
                }

                case "document":
                  return (
                    <div
                      key={i}
                      className="bg-gray-50 border p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600" />
                        <div>
                          <p className="font-medium">Document</p>
                          <p className="text-sm text-gray-500 break-all">
                            {block.value}
                          </p>
                        </div>
                      </div>

                      <a
                        href={block.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-indigo-700"
                      >
                        <File size={16} />
                        Open
                      </a>
                    </div>
                  );

                default:
                  return null;
              }
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;