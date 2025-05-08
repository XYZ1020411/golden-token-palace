
import { useState, useEffect } from "react";
import { Button } from "./button";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onVerify: (code: string) => void;
  length?: number;
}

export const Captcha = ({ onVerify, length = 4 }: CaptchaProps) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");

  const generateCaptchaText = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptchaText());
    setUserInput("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleVerify = () => {
    // Case insensitive comparison
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      onVerify(userInput);
    } else {
      refreshCaptcha();
    }
  };

  const renderCaptchaImage = () => {
    return (
      <div className="relative flex items-center justify-center h-14 w-full bg-gray-100 rounded-md select-none">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Add noise pattern with SVG */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="noise" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="#ccc" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#noise)"/>
          </svg>
        </div>
        
        <div className="relative">
          {captchaText.split('').map((char, index) => (
            <span 
              key={index}
              className="px-1 text-2xl font-bold"
              style={{
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
                display: 'inline-block',
                color: `hsl(${Math.random() * 360}, 70%, 40%)`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {renderCaptchaImage()}
        <Button variant="outline" size="icon" onClick={refreshCaptcha} type="button">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="px-3 py-2 border rounded-md w-full"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="輸入驗證碼"
        />
        <Button onClick={handleVerify} type="button">驗證</Button>
      </div>
    </div>
  );
};
