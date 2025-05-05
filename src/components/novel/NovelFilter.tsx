
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NovelFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  novelTypes: string[];
  isMobile: boolean;
}

const NovelFilter: React.FC<NovelFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  novelTypes,
  isMobile
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
      <div className="w-full md:w-1/2">
        <Input 
          placeholder="搜尋小說名稱、作者或標籤..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/3">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="選擇小說類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部類型</SelectItem>
            {novelTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NovelFilter;
