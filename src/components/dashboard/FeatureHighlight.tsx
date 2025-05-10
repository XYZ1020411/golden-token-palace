
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const FeatureHighlight = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">精彩漫畫與小說</h2>
            <p>來自 Open Library 的優質內容已可瀏覽！全新體驗等您探索。</p>
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={() => navigate("/manga-fox")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              立即閱讀
            </Button>
          </div>
          <BookOpen className="h-24 w-24 opacity-20" />
        </div>
      </CardContent>
    </Card>
  );
};
