import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit3, MapPin, Phone, Mail, Calendar } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate about sustainable living and finding unique vintage items. Love connecting with fellow eco-conscious shoppers!',
    avatar: '/placeholder.svg',
    joinedDate: '2023-06-15',
    totalSales: 12,
    totalPurchases: 28,
    rating: 4.8
  });

  const handleSave = () => {
    // TODO: Implement profile update
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? 'default' : 'outline'}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-center font-semibold"
                />
              ) : (
                <h2 className="text-xl font-semibold text-foreground">{profileData.name}</h2>
              )}

              <div className="flex items-center justify-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {isEditing ? (
                  <Input
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="text-center border-0 p-0 h-auto"
                  />
                ) : (
                  <span>{profileData.location}</span>
                )}
              </div>

              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-foreground">{profileData.totalSales}</div>
                  <div className="text-muted-foreground">Sales</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{profileData.totalPurchases}</div>
                  <div className="text-muted-foreground">Purchases</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">⭐ {profileData.rating}</div>
                  <div className="text-muted-foreground">Rating</div>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit mx-auto">
                <Calendar className="h-3 w-3 mr-1" />
                Joined {new Date(profileData.joinedDate).toLocaleDateString()}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <span className="text-foreground">{profileData.email}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <span className="text-foreground">{profileData.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full h-24 p-3 border border-input rounded-md resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {profileData.bio || 'No bio added yet.'}
                </p>
              )}
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex space-x-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;