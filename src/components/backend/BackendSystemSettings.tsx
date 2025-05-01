
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Database, Save, Upload, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface BackendSystemSettingsProps {
  backupData: () => string; // Changed from generateSystemBackup
  restoreData: (jsonData: string) => boolean; // Changed from restoreSystemBackup
  wishPool?: ReactNode; // Added optional wishPool prop
}

export const BackendSystemSettings = ({
  backupData, // Changed from generateSystemBackup
  restoreData, // Changed from restoreSystemBackup
  wishPool
}: BackendSystemSettingsProps) => {
  const [fileContent, setFileContent] = useState("");
  const [backupTimestamp, setBackupTimestamp] = useState<string | null>(null);

  const handleBackup = () => {
    try {
      const data = backupData(); // Changed from generateSystemBackup
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `backend-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupTimestamp(new Date().toLocaleString());

      toast({
        title: "備份成功",
        description: "系統數據已成功備份"
      });
    } catch (error) {
      console.error("備份錯誤:", error);
      toast({
        title: "備份錯誤",
        description: "無法創建備份文件",
        variant: "destructive"
      });
    }
  };

  const handleRestore = () => {
    if (!fileContent.trim()) {
      toast({
        title: "還原錯誤",
        description: "請先輸入備份數據",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = restoreData(fileContent); // Changed from restoreSystemBackup
      if (success) {
        setFileContent("");
        toast({
          title: "還原成功",
          description: "系統數據已成功還原"
        });
      }
    } catch (error) {
      console.error("還原錯誤:", error);
      toast({
        title: "還原錯誤",
        description: "無法解析備份數據",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileContent(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            系統數據管理
          </CardTitle>
          <CardDescription>備份或還原系統數據</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">數據備份</h3>
              <p className="text-sm text-muted-foreground mb-4">
                創建系統數據的完整備份，包括用戶、公告和設置
              </p>
              <div className="flex justify-between items-center">
                <div>
                  {backupTimestamp && (
                    <p className="text-sm text-muted-foreground">
                      上次備份時間: {backupTimestamp}
                    </p>
                  )}
                </div>
                <Button onClick={handleBackup} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  創建備份
                </Button>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium">數據還原</h3>
              <p className="text-sm text-muted-foreground mb-4">
                從先前創建的備份中還原系統數據
              </p>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  警告：還原操作將覆蓋系統中現有的所有數據，此操作無法撤銷。
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".json"
                    id="backup-file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById("backup-file")?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    上傳備份文件
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {fileContent ? "已選擇備份文件" : "未選擇文件"}
                  </span>
                </div>
                <div>
                  <Label htmlFor="backup-content" className="text-sm font-medium">
                    或貼上備份內容：
                  </Label>
                  <Textarea
                    id="backup-content"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="貼上備份的JSON數據..."
                    rows={8}
                    className="font-mono text-sm mt-2"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleRestore} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    還原數據
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Render the wishPool component if provided */}
      {wishPool && (
        <div className="mt-4">
          {wishPool}
        </div>
      )}
    </div>
  );
};
