
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Gift, Users, CreditCard, CloudSun, Database } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-primary">黃金令牌管理系統</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">進入系統</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">登入</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">註冊</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            全方位的<span className="text-primary">點數管理</span>系統
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            安全、高效的點數管理，VIP會員專屬福利，以及豐富的資訊服務
          </p>
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">進入儀表板</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/register">立即開始使用</Link>
            </Button>
          )}
        </section>

        {/* Features */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">主要功能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">錢包系統</h3>
              <p className="text-muted-foreground">
                安全管理您的點數，隨時查看交易記錄，輕鬆轉賬與贈送
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">VIP專享功能</h3>
              <p className="text-muted-foreground">
                每日簽到獎勵、VIP等級系統、獨家商品兌換及VIP專屬遊戲
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CloudSun className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">信息服務</h3>
              <p className="text-muted-foreground">
                即時新聞資訊、全台天氣預報、天氣警報及颱風預報
              </p>
            </div>
          </div>
        </section>

        {/* User Types */}
        <section className="py-16 bg-secondary/30 rounded-xl p-8 my-8">
          <h2 className="text-3xl font-bold text-center mb-12">帳號類型</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                普通會員
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 點數管理與交易</li>
                <li>• 資訊服務存取</li>
                <li>• 基本帳戶功能</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 shadow-sm border border-amber-200">
              <h3 className="text-xl font-bold mb-2 flex items-center text-primary">
                <Gift className="h-5 w-5 mr-2" />
                VIP會員
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 所有普通會員功能</li>
                <li>• 每日簽到獎勵</li>
                <li>• 專屬VIP遊戲</li>
                <li>• 獨家商品兌換</li>
                <li>• VIP等級制度</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                管理員
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 用戶管理</li>
                <li>• 系統公告發布</li>
                <li>• 點數管理</li>
                <li>• 數據備份與恢復</li>
                <li>• 系統設置管理</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">立即開始使用</h2>
          <p className="text-xl text-muted-foreground mb-8">
            註冊帳號，體驗完整功能
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">登入系統</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to="/register">立即註冊</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} 黃金令牌管理系統 - 保留所有權利
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
