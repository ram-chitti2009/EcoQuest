//functions to query supabase database CRUD OPS

import { createClient } from "./client";
const supabase = createClient();

//crud ops for leaderboard

export interface Leaderboard {
  id: string;
  rank: number;
  name: string;
  avatar?: string | null;
  carbon_saved?: number | null;
  events_joined?: number | null;
  volunteer_hours?: number | null;
  type?: string | null;
  streak?: number | null;
  level?: number | null;
  created_at?: string | null;
  user_id?: string | null;
}


export interface LeaderboardInsert {
  rank: number;
  name: string;
  avatar?: string | null;
  carbon_saved?: number | null;
  events_joined?: number | null;
  volunteer_hours?: number | null;
  type?: string | null;
  streak?: number | null;
  level?: number | null;
  user_id?: string | null;
}

export interface LeaderboardUpdate {
  rank?: number;
  name?: string;
  avatar?: string | null;
  carbon_saved?: number | null;
  events_joined?: number | null;
  volunteer_hours?: number | null;
  type?: string | null;
  streak?: number | null;
  level?: number | null;
  user_id?: string | null;
}

//crud ops for leaderboard

//Create- insert a new leaderboard entry



export async function createLeaderboardEntry(data:LeaderboardInsert){
    const{data:result, error} = await supabase
    .from('leaderboard')
    .insert(data)
    .select()
    .single();

    if(error){
        console.error("Error creating leaderboard entry:", error);
        return {data:null, error};
    }
    
    return {data:result, error:null};
}


//Read- get all leaderboard entries

export async function getAllLeaderboardEntries(){
    const{data, error} = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true });
    if(error){
        console.error("Error fetching leaderboard entries:", error);
        return {data:[], error};
    }
    return {data, error:null};

}



//Read- get leaderboard entry by id


export async function getLeaderboardEntryById(id : string){
    const {data, error} = await supabase
    .from('leaderboard')
    .select('*')
    .eq('id', id)
    .single();

    if(error){
        console.error("Error fetching leaderboard entry:", error);
        return {data:null, error};
    }

    return {data, error:null};
}


//READ get leaderboard entries by user id


export async function getLeaderboardEntriesByUserId(userId:string){
    const {data, error} = await supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .order('rank', { ascending: true });

    if(error){
        console.error("Error fetching leaderboard entries:", error);
        return {data:[], error};
    }

    return {data, error:null};
}
//Read - get top N leaderboard entries

export async function getTopLeaderboardEntries(limit:number=10){
    const {data, error} = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true })
    .limit(limit);

    if(error){
        console.error("Error fetching top leaderboard entries:", error);
        return {data:[], error};
    }

    return {data, error:null};
}


//Update - updare leaderboard entry

export async function updateLeaderboardEntry(id:string, updates: LeaderboardUpdate){
    const {data, error} = await supabase
    .from('leaderboard')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

    if(error){
        console.error("Error updating leaderboard entry:", error);
        return {data:null, error};
    }

    return {data, error:null};
}

//Delete - delete leaderboard entry by id
export async function deleteLeaderboardEntry(id:string){
    const {error} = await supabase
    .from('leaderboard')
    .delete()
    .eq('id', id);

    if(error){
        console.error("Error deleting leaderboard entry:", error);
        return {data:null, error};
    }

    return {data:true, error:null};
}

//Delete all leaderboard entries for a user
export async function deleteLeaderboardEntriesByUserId(userId:string){
    const {error} = await supabase
    .from('leaderboard')
    .delete()
    .eq('user_id', userId);

    if(error){
        console.error("Error deleting leaderboard entries:", error);
        return {data:null, error};
    }

    return {data:true, error:null};
}


//crud ops for user_profiles table
//interfaces
export interface UserProfile {
  id: string;
  name: string;
  title?: string | null;
  about?: string | null;
  profile_image_url?: string | null;
  city?: string | null;
  country?: string | null;
  member_since?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserProfileInsert{
    id : string, 
    name : string, 
    title? : string|null,
    about? : string | null,
    profile_image_url? : string | null;
    city? : string|null,
    country?: string|null,
    member_since? : string|null
}


export interface UserProfileUpdate{
    name? : string;
    title? : string|null;
    about?:string|null;
    profile_image_url? : string | null;
    city? : string|null,
    country? : string|null
}
//read all rows

export async function getAllUserProfiles(){
    const {data, error} = await supabase.
    from('user_profiles')
    .select('*')

    .order('created_at', { ascending: false });
    if(error){
        console.error("Error fetching user profiles:", error);
        return {data:[], error};
    }
    return {data, error:null};

}

export async function getUserProfileByUserId(userId: string){
    const {data, error} = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

    if(error){
        console.error("Error fetching user profile:", error);
        return {data:null, error};
    }

    return {data, error:null};
}



//insert profile
export async function createUserProfile(data:UserProfileInsert){
    const { data: result, error} = await supabase
    .from('user_profiles')
    .insert(data)
    .select()
    .single();

    if(error){
        console.error("Error creating user profile:", error);
        return {data: null, error};
    }

    return {data: result, error: null};
}

//update - update user profile
export async function updateUserProfile(userId:string, updates : UserProfileUpdate){
    const {data, error} = await supabase
    .from('user_profiles')
    .update({
        ...updates,
        updated_at : new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

    if(error){
        console.error("Error updating user profile:", error);
        return {data:null, error};
    }

    return {data, error:null};
}

export async function deleteUserProfile(userId:string){
    const {error} = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);

    if(error){
        console.error("Error delete user profile", error);
        return {data: null, error};
    }

    return {data: true, error: null};
}





//Crud ops for userStats

// Types for user statistics
export interface UserStatistics{
    id : string;
    user_id?: string|null;
    carbon_saved? : number | null;
    volunteer_hours? : number|null;
    cleanups_participated? : number|null;
    created_at? : string|null;
    updated_at? : string | null
}

export interface UserStatisticsInsert {
    user_id : string;
    carbon_saved?: number|null;
    volunteer_hours?: number | null;
    cleanups_participated? : number | null;
}

export interface UserStatisticsUpdate {
  carbon_saved?: number | null;
  volunteer_hours?: number | null;
  cleanups_participated?: number | null;
}

export async function createUserStatistics(data:UserStatisticsInsert){
    const {data:result, error} = await supabase.
    from('user_statistics')
    .insert(data)
    .select()
    .single()

    if(error){
        console.error("Error Creating user Statistics", error)
        return {data:null, error}
    }

    return {data:result, error:null};
}

//read-get user statistics by Id
export async function getUserStatistics(userId: string) {
    const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error("Error fetching user statistics:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

//Update-update user statistics
export async function updateUserStatistics(userId:string, updates: UserStatisticsUpdate){
    const{data, error} = await supabase.
    from('user_statistics')
    .update({
        ...updates,
        updated_at : new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

    if(error){
        console.error("error updating user statistics", error)
    }
    return {data, error:null}
}


//delete - delete user statistics
export async function deleteUserStatistics(userId:string){
    const{error} = await supabase.
    from('user_statistics')
    .delete()
    .eq('user_id', userId);


    if(error){
        console.error("Error deleting user statisics", error)
        return {data :null, error}
    }


    return{data:true, error:null}

}

//Universal Achievements Table 
export async function fetchAllAchievements(){
    
const { data: achievements, error } = await supabase
  .from('achievements')
  .select('*')
          
if(error){
    console.error("Error fetching all Achievemnts", error)
    return {data:null, error};

}
return { data:achievements, error:null}
}



//Universal Badges Table
export async function fetchAllBadges(){
    const{data:badges, error} = await supabase
    .from('badges')
    .select('*')
    if(error){
        console.error("Error fetching all badges", error)
        return {data:null, error}
    }

    return {data:badges, error:null}
}



//User badges crud

export interface UserBadge{
    id:number;
    user_id:string;
    badge_id:number;
    awarded_at?:string|null
}

export interface UserBadgeInsert{
    user_id: string;
    badge_id : number;
    awarded_at? : string|null
}

export interface UserBadgeUpdate{
    awarded_at? : string|null
}

//get all user badges by user_id

export async function fetchBadgesByUserId(userId:string){
    const {data:badges, error} = await supabase.
    from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .single();

    if(error){
        console.error("error obtaining user badges", error)
        return{data:null, error}
    }

    return {data:badges, error:null}
}

//award a badge to the user

export async function createUserBadge(data:UserBadgeInsert){
    const {data:result, error} = await supabase.
    from('user_badges')
    .insert(data)
    .select()
    .single()

    if(erorr){
        console.error("Error creaitng user badge", error)
        return {data:null, error};
    }
    return {data:result, error:null}

}

// Update - Update user badge
export async function updateUserBadge(id: number, updates: UserBadgeUpdate) {
  const { data, error } = await supabase
    .from('user_badges')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user badge:", error);
    return { data: null, error };
  }

  return { data, error: null };
}


//Delete- remove a badge from user

export async function deleteUserBadge(id:number){
    const {error} = await supabase
    .from('user_badges')
    .delete()
    .eq('id', id);

    if(error){
        console.error("Error deleting user badge: ", error)
        return {data:null, error}
    }
    return {data:true, error:null}


}


//Crud ops for user impact details


export interface UserImpactDetails{
    id:string;
    user_id?:string|null;
    category_id?:number|null;
    current_value:number;
    last_updated? : string|null;
    created_at? : string|null
}

export interface UserImpactDetailsInsert{
    user_id:string;
    category_id : number;
    current_value : number;
    last_updated? : string|null
}

export interface UserImpactDetailsUpdate{
    current_value? : number;
    last_updated? : string|null;
}

export async function createUserImpactDetails(data:UserImpactDetailsInsert){

    const {data:result, error} = await supabase.
    from('user_impact_details')
    .insert(data)
    .select()
    .single()

    if(error){
        console.error("Error creating user impact details", error)
        return {data:[], error};
    }

    return {data, error:null}

}


export async function updateUserImpactDetails(userId:string, categoryId:number, updates:UserImpactDetailsUpdate){
    const{data, error} = await supabase
    .from('user_impact_details')
    .update({
        ...updates,
        last_updated:new Date(0.toISOString())
    })
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .select().
    single()


    if(error){
        console.error("Error updating user impact details")
        return {data:null, error};
    }


    return {data, error:null}
}


export async function getUserImpactDetails(userId:string){
    const {data, error} = await supabase.
    from('user_impact_details')
    .select('*')
    .eq('user_id', userId)

    if(error){
        console.error("Error fetching user impact details")
        return {data:[], error}
    }

    return {data, error:null}
}

export async function deleteUserImpactDetails(userId:string, categoryId:string){
    const {error} = await supabase.
    from('user_impact_details')
    .delete()
    .eq('user_id', userId)
    .eq('category_id', categoryId);


    if(error){
        console.error("Error deleting user impact details", error)
        return {data:null, error}
    }

    return {data:true, error:null}
}



export interface userImpactAchievement{
    id:number;
    user_id? : string|null;
    impact_acheivement_id? : number|null
}


export interface UserImpactAchievementInsert{
    user_id:string;
    impact_achievement_id:number;
}


export interface UserImpactAchievementUpdate{
    impact_achievement_id? : number;
}


///Create - award achievement to the user


export async function createUserImpactAchievement(data: UserImpactAchievementInsert){
    const {data:result, error} = await supabase.
    from('user_impact_achievements')
    .insert(data)
    .select()
    .single()


    if(error){
        console.error("Error creating user impact achievement", error)
        return {data:null, error}

    }

    return {data:result, error:null}
}

export async function getUserImpactAchievemnt(userId:string){
   const { data, error } = await supabase
    .from('user_impact_achievements')
    .select(`
      *,
      impact_achievements (
        id,
        title,
        description,
        category_id,
        required_value,
        achievement_type,
        icon,
        badge_color
      )
    `)
    .eq('user_id', userId);

    if(error){
        console.error("Error fetching user impact  ", error)
        return {data:[], error};
    }
    return {data, error:null}

}

export async function updateUserImpactAchievement(id:number, updates:UserImpactAchievementUpdate){

    const {data, error} = await supabase
    .from('user_impact_achievements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

    if(error){
        console.error("Error updating user impact achievements")
        return {data:null, error}
    }

}


//Delete

export async function deleteUserImpactAchievement(id:number){
    const {error} = await supabase
    .from('user_impact_achievements')
    .delete()
    .eq('id', id)

    if(error){
        console.error("Error deleting user impact achievements", error)
        return {data:null, error}
    }

    return {data:true, error:null}
}



//fetch all monthly goals
export async function fetchAllMonthlyGoals(){
    const {data:goals, error} = await supabase
    .from('monthly_goals')
    .select('*')

    if(error){
        console.error("Error fetching all monthly goals", error)
        return {data:[], error}
    }

    return {data:goals, error:null}
}


//Types for user monthly goals

export interface UsersMonthlyGoal{
    id:number;
    user_id:string;
    goal_id:number;
    custom_target?:number|null;
    progress? : number|null;
    month:string;
}

export interface UsersMonthlyGoalInsert{
    user_id:string;
    goal_id:number;
    custom_target?:number|null;
    progress?:number|null;
    month:string
}

export interface UsersMonthlyGoalUpdate{
    custom_target?:number|null;
    progress?:number|null
}

//Create user monthly goal

export async function createUsersMonthlyGoal(data: UsersMonthlyGoalInsert) {
  const { data: result, error } = await supabase
    .from('users_monthly_goals')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating users monthly goal:", error);
    return { data: null, error };
  }

  return { data: result, error: null };
}


// Read - Get user's monthly goals for a specific month
export async function getUsersMonthlyGoals(userId: string, month: string) {
  const { data, error } = await supabase
    .from('users_monthly_goals')
    .select(`
      *,
      monthly_goals (
        id,
        title,
        description,
        default_target,
        unit,
        category
      )
    `)
    .eq('user_id', userId)
    .eq('month', month);

  if (error) {
    console.error("Error fetching users monthly goals:", error);
    return { data: [], error };
  }

  return { data, error: null };
}


export async function updateUsersMonthlyGoal(id:number, updates:UsersMonthlyGoalUpdate){
    const{data, error} = await supabase.
    from('users_monthly_goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()


    if(error){
        console.error("Erorr updating users monthly goals", error)
        return {data:null, error}
    }

    return {data, error:null}
}

export async function deleteUsersMonthlyGoal(id: number) {
  const { error } = await supabase
    .from('users_monthly_goals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting users monthly goal:", error);
    return { data: null, error };
  }

  return { data: true, error: null };
}



//fetch all achievements


