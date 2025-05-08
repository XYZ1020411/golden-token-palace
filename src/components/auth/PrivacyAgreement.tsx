
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface PrivacyAgreementProps {
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
}

export const PrivacyAgreement = ({ agreed, onAgreeChange }: PrivacyAgreementProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="privacy-policy" 
          checked={agreed} 
          onCheckedChange={(checked) => onAgreeChange(checked === true)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="privacy-policy" className="text-sm font-medium leading-none">
            我已閱讀並同意
            <Button
              variant="link"
              className="h-auto p-0 px-1"
              onClick={() => setDialogOpen(true)}
            >
              隱私權政策
            </Button>
          </Label>
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>隱私權政策</DialogTitle>
            <DialogDescription>
              請仔細閱讀以下隱私權政策
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-72 rounded-md border p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">1. 個人資料的收集</h3>
              <p>
                本系統將收集您的用户名、電子郵件地址等資訊，用於帳户註冊和身份驗證。
              </p>
              
              <h3 className="font-semibold">2. 個人資料的使用</h3>
              <p>
                收集的個人資料將用於以下目的：
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>提供帳户管理和身份驗證服務</li>
                <li>推送相關通知和更新</li>
                <li>改進我們的服務</li>
                <li>處理您的查詢和請求</li>
              </ul>
              
              <h3 className="font-semibold">3. 個人資料的披露</h3>
              <p>
                我們不會出售、交易或出租您的個人資料給第三方。但在以下情況下，我們可能會分享您的資料：
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>為了遵守法律法規的要求</li>
                <li>保護我們的權利和財產</li>
                <li>在緊急情況下保護用户或公眾的安全</li>
              </ul>
              
              <h3 className="font-semibold">4. 資料安全</h3>
              <p>
                我們實施了適當的技術和組織措施，以保護您的個人資料不被意外丟失、使用或訪問。
              </p>
              
              <h3 className="font-semibold">5. 您的權利</h3>
              <p>
                根據適用的數據保護法律，您可能有以下權利：
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>要求訪問您的個人資料</li>
                <li>要求更正不准確的資料</li>
                <li>要求刪除您的資料</li>
                <li>反對我們處理您的資料</li>
                <li>要求限制處理您的資料</li>
                <li>要求轉移您的資料</li>
              </ul>
              
              <h3 className="font-semibold">6. Cookie和類似技術</h3>
              <p>
                我們使用cookies和類似技術來改善用户體驗、分析網站使用情況等。
              </p>
              
              <h3 className="font-semibold">7. 兒童隱私</h3>
              <p>
                我們的服務不針對13歲以下兒童，我們不會有意收集兒童的個人資料。
              </p>
              
              <h3 className="font-semibold">8. 政策更新</h3>
              <p>
                我們可能會不時更新本隱私權政策。變更生效時，我們會通過網站通知您。
              </p>
              
              <h3 className="font-semibold">9. 聯絡我們</h3>
              <p>
                如有任何疑問，請通過以下方式聯絡我們：contact@example.com
              </p>
            </div>
          </ScrollArea>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>關閉</Button>
            <Button onClick={() => {
              onAgreeChange(true);
              setDialogOpen(false);
            }}>
              接受條款
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
