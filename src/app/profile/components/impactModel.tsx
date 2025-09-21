import { Award, Calendar, Clock, Leaf, Target, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ImpactModalProps {
  userStats: {
    carbonSaved: number;
    volunteerHours: number;
    cleanupsParticipated: number;
  };
}

export const ImpactModal: React.FC<ImpactModalProps> = ({ userStats }) => {
  const [isOpen, setIsOpen] = useState(false);

  const impactDetails = [
    {
      category: "Carbon Footprint Reduction",
      value: userStats.carbonSaved,
      unit: "kg CO₂",
      description: "Equivalent to planting 5 trees or driving 312 miles less",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-800"
    },
    {
      category: "Community Service",
      value: userStats.volunteerHours,
      unit: "hours",
      description: "Making a difference in your local community",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-800"
    },
    {
      category: "Environmental Events",
      value: userStats.cleanupsParticipated,
      unit: "cleanups",
      description: "Active participation in environmental restoration",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      textColor: "text-orange-800"
    }
  ];

  const monthlyGoals = [
    { label: "Carbon Reduction Goal", current: 127.5, target: 150, unit: "kg CO₂" },
    { label: "Volunteer Hours Goal", current: 24, target: 30, unit: "hours" },
    { label: "Events Participation", current: 8, target: 10, unit: "events" }
  ];

  const achievements = [
    { title: "Eco Warrior", description: "Saved over 100kg of CO₂", earned: true },
    { title: "Community Hero", description: "20+ volunteer hours", earned: true },
    { title: "Event Champion", description: "Joined 5+ cleanup events", earned: true },
    { title: "Climate Guardian", description: "150kg CO₂ saved", earned: false }
  ];

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs sm:text-sm font-medium bg-white border-2 hover:bg-gray-50 px-3 sm:px-4 text-black hover:text-gray-800 shadow-sm flex items-center gap-2"
      >
        View Details
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Environmental Impact</h2>
                <p className="text-gray-600">Detailed overview of your contributions</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Impact Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactDetails.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className={`border-0 shadow-lg ${item.bgColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${item.bgColor}`}>
                        <IconComponent className={`w-8 h-8 ${item.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${item.textColor}`}>{item.value}</p>
                        <p className={`text-sm ${item.textColor} opacity-80`}>{item.unit}</p>
                      </div>
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${item.textColor}`}>{item.category}</h3>
                    <p className={`text-sm ${item.textColor} opacity-90`}>{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Monthly Progress */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {monthlyGoals.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{goal.label}</span>
                      <span className="text-sm text-gray-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{Math.round(progress)}% complete</span>
                      <span>{Math.max(0, goal.target - goal.current)} {goal.unit} to go</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-600" />
                Impact Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      achievement.earned
                        ? "bg-green-50 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}>
                        <Award className={`w-5 h-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.earned ? "text-green-800" : "text-gray-500"}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${achievement.earned ? "text-green-700" : "text-gray-400"}`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inspirational Section */}
          <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-white opacity-90" />
              <h3 className="text-2xl font-bold mb-3">Keep Making a Difference!</h3>
              <p className="text-lg mb-4 text-blue-100">
                Your actions are contributing to a more sustainable future
              </p>
              <p className="text-sm text-blue-100">
                Together, we can build a greener world for future generations 🌍
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};