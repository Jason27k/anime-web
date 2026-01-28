"use client";

import { useContext, useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  SettingsContext,
  LanguageType,
  CardSize,
  GridDensity,
} from "@/app/Provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Globe,
  LayoutGrid,
  Eye,
  User,
  LogOut,
  KeyRound,
  Settings,
} from "lucide-react";

interface ProfileSidebarProps {
  stats?: {
    watching: number;
    completed: number;
    dropped: number;
    total: number;
  };
}

export default function ProfileSidebar({ stats }: ProfileSidebarProps) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { settings, updateSettings } = useContext(SettingsContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Match md breakpoint (768px)
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const languageOptions = [
    { value: LanguageType.English, label: "English" },
    { value: LanguageType.Romanji, label: "Romaji" },
    { value: LanguageType.Japanese, label: "Japanese" },
  ];

  const cardSizeOptions: { value: CardSize; label: string }[] = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const gridDensityOptions: { value: GridDensity; label: string }[] = [
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

  // Settings content - shared between desktop card and mobile drawer
  const SettingsContent = () => (
    <div className="space-y-4">
      {/* Language */}
      <div className="space-y-2">
        <Label className="text-sm flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          Title Language
        </Label>
        <Select
          value={settings.language}
          onValueChange={(value) =>
            updateSettings({ language: value as LanguageType })
          }
        >
          <SelectTrigger className="bg-[#191d26] border-0 hover:bg-[#252a36] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#191d26] border-0">
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-[#191d26]" />

      {/* Display Settings */}
      <div className="space-y-3">
        <Label className="text-sm flex items-center gap-2 text-muted-foreground">
          <LayoutGrid className="h-4 w-4" />
          Display
        </Label>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Card Size</Label>
          <Select
            value={settings.cardSize}
            onValueChange={(value) =>
              updateSettings({ cardSize: value as CardSize })
            }
          >
            <SelectTrigger className="bg-[#191d26] border-0 hover:bg-[#252a36] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#191d26] border-0">
              {cardSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Grid Density</Label>
          <Select
            value={settings.gridDensity}
            onValueChange={(value) =>
              updateSettings({ gridDensity: value as GridDensity })
            }
          >
            <SelectTrigger className="bg-[#191d26] border-0 hover:bg-[#252a36] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#191d26] border-0">
              {gridDensityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-[#191d26]" />

      {/* Visibility Settings */}
      <div className="space-y-3">
        <Label className="text-sm flex items-center gap-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          Visibility
        </Label>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-white">Show Airing Time</Label>
          <Switch
            checked={settings.showAiringTime}
            onCheckedChange={(checked) =>
              updateSettings({ showAiringTime: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-white">Show Episode Progress</Label>
          <Switch
            checked={settings.showEpisodeProgress}
            onCheckedChange={(checked) =>
              updateSettings({ showEpisodeProgress: checked })
            }
          />
        </div>
      </div>
    </div>
  );

  // Account content - shared between desktop card and mobile drawer
  const AccountContent = () => (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-[#191d26] hover:text-white"
        onClick={() => openUserProfile()}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        Manage Account
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-red-400 hover:bg-red-950 hover:text-red-300"
        onClick={() => signOut()}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* User Profile Card - Always visible */}
      <Card className="bg-[#1f232d] border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "User"}
              className="w-16 h-16 rounded-full bg-[#191d26]"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {user?.fullName || user?.username || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="bg-[#191d26] rounded-lg p-2">
                <p className="text-xl font-bold text-blue-400">{stats.watching}</p>
                <p className="text-xs text-muted-foreground">Watching</p>
              </div>
              <div className="bg-[#191d26] rounded-lg p-2">
                <p className="text-xl font-bold text-green-400">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="bg-[#191d26] rounded-lg p-2">
                <p className="text-xl font-bold text-gray-400">{stats.dropped}</p>
                <p className="text-xs text-muted-foreground">Dropped</p>
              </div>
              <div className="bg-[#191d26] rounded-lg p-2">
                <p className="text-xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          )}

          {/* Mobile: Settings & Account Button */}
          {isMobile && (
            <div className="mt-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full bg-[#191d26] text-white hover:bg-[#252a36]"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings & Account
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="bg-[#1f232d] border-0 text-white max-h-[85vh] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle className="text-white">Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-6">
                    <SettingsContent />
                    <Separator className="bg-[#191d26]" />
                    <div>
                      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Account
                      </h3>
                      <AccountContent />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop: Settings Card */}
      {!isMobile && (
        <Card className="bg-[#1f232d] border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsContent />
          </CardContent>
        </Card>
      )}

      {/* Desktop: Account Card */}
      {!isMobile && (
        <Card className="bg-[#1f232d] border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AccountContent />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
