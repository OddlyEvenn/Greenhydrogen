import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Target,
  Award,
  TrendingUp,
  Zap,
  Gift,
  Crown,
  Medal,
  Flame,
  Users,
  Calendar,
  CheckCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Temporarily comment out confetti import to avoid build issues
// import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: "production" | "trading" | "environmental" | "social";
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface UserLevel {
  current: number;
  xp: number;
  xpToNext: number;
  title: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  progress: number;
  target: number;
  reward: number;
  expiresAt: string;
  completed: boolean;
}

const achievements: Achievement[] = [
  {
    id: "first-credit",
    title: "First Steps",
    description: "Earn your first green hydrogen credit",
    icon: Star,
    category: "production",
    points: 100,
    rarity: "common",
    unlocked: true,
    unlockedDate: "2024-01-15",
    progress: 1,
    maxProgress: 1,
  },
  {
    id: "carbon-saver",
    title: "Carbon Saver",
    description: "Retire 50 credits for carbon neutrality",
    icon: Trophy,
    category: "environmental",
    points: 500,
    rarity: "rare",
    unlocked: true,
    unlockedDate: "2024-01-20",
    progress: 50,
    maxProgress: 50,
  },
  {
    id: "trading-master",
    title: "Trading Master",
    description: "Complete 100 successful trades",
    icon: TrendingUp,
    category: "trading",
    points: 750,
    rarity: "epic",
    unlocked: false,
    progress: 67,
    maxProgress: 100,
  },
  {
    id: "eco-champion",
    title: "Eco Champion",
    description: "Achieve carbon neutrality through credit retirement",
    icon: Crown,
    category: "environmental",
    points: 1000,
    rarity: "legendary",
    unlocked: false,
    progress: 68,
    maxProgress: 100,
  },
];

const dailyChallenges: Challenge[] = [
  {
    id: "daily-trade",
    title: "Daily Trader",
    description: "Complete 3 trades today",
    type: "daily",
    progress: 2,
    target: 3,
    reward: 50,
    expiresAt: "2024-01-29T23:59:59",
    completed: false,
  },
  {
    id: "production-check",
    title: "Production Monitor",
    description: "Check production dashboard",
    type: "daily",
    progress: 1,
    target: 1,
    reward: 25,
    expiresAt: "2024-01-29T23:59:59",
    completed: true,
  },
];

export function GamificationSystem({ userRole }: { userRole: string }) {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    current: 7,
    xp: 2340,
    xpToNext: 660,
    title: "Green Pioneer",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti animation
  const triggerConfetti = () => {
    // Fallback for confetti - can be replaced when library is properly loaded
    console.log("🎉 Achievement unlocked!");
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 }
    // });
  };

  // Achievement unlock simulation
  const unlockAchievement = (achievementId: string) => {
    // This would typically be called from the backend when conditions are met
    triggerConfetti();
    // Update achievements state
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 bg-gray-100";
      case "rare":
        return "text-blue-600 bg-blue-100";
      case "epic":
        return "text-purple-600 bg-purple-100";
      case "legendary":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "production":
        return Target;
      case "trading":
        return TrendingUp;
      case "environmental":
        return Trophy;
      case "social":
        return Users;
      default:
        return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Level & XP */}
      <Card className="bg-gradient-to-r from-eco-green-500 to-eco-blue-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Level {userLevel.current}
                </h2>
                <p className="text-white/80">{userLevel.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {userLevel.xp.toLocaleString()}
              </div>
              <div className="text-white/80 text-sm">Total XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel.current + 1}</span>
              <span>{userLevel.xpToNext} XP needed</span>
            </div>
            <Progress
              value={(userLevel.xp / (userLevel.xp + userLevel.xpToNext)) * 100}
              className="h-3 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: "overview", label: "Overview", icon: Trophy },
          { id: "achievements", label: "Achievements", icon: Award },
          { id: "challenges", label: "Challenges", icon: Target },
          { id: "leaderboard", label: "Leaderboard", icon: Users },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {achievements.filter((a) => a.unlocked).length}/
                {achievements.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {achievements.filter((a) => !a.unlocked).length} remaining
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">7 days</div>
              <div className="text-sm text-muted-foreground">
                Daily login streak
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {achievements
                  .filter((a) => a.unlocked)
                  .reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Achievement points earned
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            getRarityColor(achievement.rarity),
                          )}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-eco-green-600">
                            +{achievement.points} XP
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.unlockedDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            const CategoryIcon = getCategoryIcon(achievement.category);

            return (
              <Card
                key={achievement.id}
                className={cn(
                  "hover:shadow-lg transition-all duration-300",
                  achievement.unlocked ? "hover:scale-105" : "opacity-75",
                  !achievement.unlocked && "border-dashed",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        achievement.unlocked
                          ? getRarityColor(achievement.rarity)
                          : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {achievement.unlocked ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {achievement.category}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          getRarityColor(achievement.rarity),
                        )}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>

                  {achievement.maxProgress && achievement.maxProgress > 1 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress
                        value={
                          (achievement.progress! / achievement.maxProgress) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-eco-green-600 font-bold">
                      +{achievement.points} XP
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-eco-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Challenges
              </CardTitle>
              <CardDescription>
                Complete daily tasks to earn bonus XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        challenge.completed
                          ? "bg-eco-green-100 text-eco-green-600"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {challenge.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Target className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      {!challenge.completed && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {challenge.progress}/{challenge.target}
                            </span>
                          </div>
                          <Progress
                            value={
                              (challenge.progress / challenge.target) * 100
                            }
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-eco-green-600">
                        +{challenge.reward} XP
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {challenge.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly & Monthly Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly & Monthly Challenges</CardTitle>
              <CardDescription>
                Bigger challenges for bigger rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Weekly and monthly challenges will be available in the next
                  update
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Global Leaderboard
            </CardTitle>
            <CardDescription>
              See how you rank against other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rank: 1, name: "EcoMaster", xp: 15420, badge: "🥇" },
                { rank: 2, name: "GreenGuru", xp: 14890, badge: "🥈" },
                { rank: 3, name: "H2Hero", xp: 13250, badge: "🥉" },
                {
                  rank: 4,
                  name: "You",
                  xp: 2340,
                  badge: "👤",
                  isCurrentUser: true,
                },
                { rank: 5, name: "CleanEnergy", xp: 2100, badge: "" },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg",
                    user.isCurrentUser
                      ? "bg-primary/10 border-2 border-primary"
                      : "hover:bg-muted/50",
                  )}
                >
                  <div className="text-2xl font-bold w-8">
                    {user.badge || `#${user.rank}`}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.xp.toLocaleString()} XP
                    </div>
                  </div>
                  {user.isCurrentUser && (
                    <Badge className="bg-primary text-primary-foreground">
                      You
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
