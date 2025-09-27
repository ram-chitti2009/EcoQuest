//functions to query supabase database CRUD OPS

import { constants } from "fs/promises";
import { createClient } from "./client";
const supabase = createClient();

//crud ops for leaderboard

export interface Leaderboard {
  id: string;
  rank: number;
  name: string;
  avatar?: string | null;
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
  type?: string | null;
  streak?: number | null;
  level?: number | null;
  user_id?: string | null;
}

export interface LeaderboardUpdate {
  rank?: number;
  name?: string;
  avatar?: string | null;
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
    quiz_correct_answers? : number|null;
    xp? : number|null;
    created_at? : string|null;
    updated_at? : string | null
}

export interface UserStatisticsInsert {
    user_id : string;
    carbon_saved?: number|null;
    volunteer_hours?: number | null;
    cleanups_participated? : number | null;
    quiz_correct_answers?: number | null;
}

export interface UserStatisticsUpdate {
  carbon_saved?: number | null;
  volunteer_hours?: number | null;
  cleanups_participated?: number | null;
  quiz_correct_answers?: number | null;
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
    const{data, error} = await supabase
    .from('user_statistics')
    .update({
        ...updates,
        updated_at : new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

    if(error){
        console.error("error updating user statistics", error)
        return {data:null, error}
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
    const {data:result, error} = await supabase
    .from('user_badges')
    .insert(data)
    .select()
    .single()

    if(error){
        console.error("Error creating user badge", error)
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

    const {data:result, error} = await supabase
    .from('user_impact_details')
    .insert(data)
    .select()
    .single()

    if(error){
        console.error("Error creating user impact details", error)
        return {data:null, error};
    }

    return {data:result, error:null}

}


export async function updateUserImpactDetails(userId:string, categoryId:number, updates:UserImpactDetailsUpdate){
    const{data, error} = await supabase
    .from('user_impact_details')
    .update({
        ...updates,
        last_updated:new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .select()
    .single()


    if(error){
        console.error("Error updating user impact details", error)
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
        console.error("Error updating user impact achievements", error)
        return {data:null, error}
    }

    return {data, error:null}

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

// Enhanced leaderboard function with user profiles and statistics
export async function getLeaderboardWithUserData() {
  const { data, error } = await supabase
  .from('leaderboard')
  .select(`
    *,
    user_statistics(
      carbon_saved,
      volunteer_hours,
      cleanups_participated,
      quiz_correct_answers,
      xp
    )
  `)
  .order('rank', { ascending: true });

console.log("Leaderboard with stats:", data);
    if (error) {
        console.error("Error fetching leaderboard with user data:", error);
        return { data: [], error };
    }

    return { data, error: null };
}

export async function getLeaderboardWithXp(){
    const { data, error } = await supabase
        .from('leaderboard')
        .select(`
            *,
            user_statistics:user_statistics_id(
                carbon_saved,
                volunteer_hours,
                cleanups_participated,
                xp
            )
        `)
        .order('rank', { ascending: true });

    console.log("Leaderboard with stats:", data);
    if (error) {
        console.error("Error fetching leaderboard with user data:", error);
        return { data: [], error };
    }

    return { data, error: null };
}

// Get leaderboard sorted by specific metric(Arpit to work on the computation of points logic)
export async function getLeaderboardByMetric(metric: 'carbon' | 'hours' | 'cleanups' | 'points') {
    let orderColumn = 'carbon_saved';
    
    switch (metric) {
        case 'carbon':
            orderColumn = 'carbon_saved';
            break;
        case 'hours':
            orderColumn = 'volunteer_hours';
            break;
        case 'cleanups':
            orderColumn = 'cleanups_participated';
            break;
        case 'points':
            // For points, we'll need to calculate on the client side since it's computed
            orderColumn = 'carbon_saved'; // Default to carbon for now
            break;
    }

    const { data, error } = await supabase
        .from('leaderboard')
        .select(`
            *,
            user_statistics (
                carbon_saved,
                volunteer_hours,
                cleanups_participated
            )
        `)
        .order(`user_statistics(${orderColumn})`, { ascending: false });

    if (error) {
        console.error("Error fetching leaderboard by metric:", error);
        return { data: [], error };
    }

    return { data, error: null };
}

// Get community impact statistics
export async function getCommunityStats() {
    try {
        // Get total carbon saved
        const { data: carbonData, error: carbonError } = await supabase
            .from('user_statistics')
            .select('carbon_saved');

        // Get total volunteer hours
        const { data: hoursData, error: hoursError } = await supabase
            .from('user_statistics')
            .select('volunteer_hours');

        // Get total cleanups
        const { data: cleanupsData, error: cleanupsError } = await supabase
            .from('user_statistics')
            .select('cleanups_participated');

        const { data: xpData, error: xpError } = await supabase
            .from('user_statistics')
            .select('xp');

        // Get active users count
        const { count: usersCount, error: usersError } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true });

        if (carbonError || hoursError || cleanupsError || xpError || usersError) {
            console.error("Error fetching community stats");
            return {
                data: {
                    total_carbon_saved: 0,
                    total_volunteer_hours: 0,
                    total_cleanups: 0,
                    total_xp: 0,
                    active_users: 0
                },
                error: carbonError || hoursError || cleanupsError || xpError || usersError
            };
        }

        const totalCarbon = carbonData?.reduce((sum, item) => sum + (item.carbon_saved || 0), 0) || 0;
        const totalHours = hoursData?.reduce((sum, item) => sum + (item.volunteer_hours || 0), 0) || 0;
        const totalCleanups = cleanupsData?.reduce((sum, item) => sum + (item.cleanups_participated || 0), 0) || 0;
        const totalXp = xpData?.reduce((sum, item) => sum + (item.xp || 0), 0) || 0;

        return {
            data: {
                total_carbon_saved: totalCarbon,
                total_volunteer_hours: totalHours,
                total_cleanups: totalCleanups,
                total_xp: totalXp,
                active_users: usersCount || 0
            },
            error: null
        };
    } catch (error) {
        console.error("Error in getCommunityStats:", error);
        return {
            data: {
                total_carbon_saved: 0,
                total_volunteer_hours: 0,
                total_cleanups: 0,
                total_xp: 0,
                active_users: 0
            },
            error
        };
    }
}



//fetch all achievements


//CRUD OPS FOR LITTER and LITTER_SUMMARY



export interface UserLitterReport {
  id: string;
  user_id: string;
  litter_type: string;
  confidence: number;
  quantity: string;
  recyclable: boolean;
  hazard_level: string;
  recommendations: string[];
  environmental_impact: {
    decompositionTime?: string;
    carbonFootprint?: string;
    wildlifeRisk?: string;
    [key: string]: any;
  };
  created_at?: string | null;
}


export interface UserLitterReportInsert {
  user_id: string;
  litter_type: string;
  confidence: number;
  quantity: string;
  recyclable: boolean;
  hazard_level: string;
  recommendations: string[];
  environmental_impact: {
    decompositionTime?: string;
    carbonFootprint?: string;
    wildlifeRisk?: string;
    [key: string]: any;
  };
}

export interface UserLitterReportUpdate {
  litter_type?: string;
  confidence?: number;
  quantity?: string;
  recyclable?: boolean;
  hazard_level?: string;
  recommendations?: string[];
  environmental_impact?: {
    decompositionTime?: string;
    carbonFootprint?: string;
    wildlifeRisk?: string;
    [key: string]: any;
  };
}

export async function createUserLitterReport(data: UserLitterReportInsert) {
    const { data: result, error } = await supabase
        .from('user_litter_reports')
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Error creating user litter report:", error);
        return { data: null, error };
    }

    return { data: result, error: null };
}

//Read - get all litter reports for a specific user

export async function getUserLitterReports(userId:string){
    const {data, error} = await supabase
    .from('user_litter_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending:false});

    if (error) {
        console.error("Error fetching user litter reports:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

//REad - get specific litter report by id
export async function getUserLitterReportById(id:string){
    const{data, error} = await supabase.
    from('user_litter_reports')
    .select('*')
    .eq('id', id)
    .single();

    if (error) {
        console.error("Error fetching user litter report by id:", error);
        return { data: null, error };
    }

    return { data, error: null };
}


//UPDATE- update a litter report

export async function updateUserLitterReport(id:string, updates:UserLitterReportUpdate){
    const {data, error} = await supabase
    .from('user_litter_reports')
    .update(updates)
    .eq('id', id)
    .single();

    if (error) {
        console.error("Error updating user litter report:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

//Delete - delete a litter report
export async function deleteUserLitterReport(id: string) {
  const { error } = await supabase
    .from('user_litter_reports')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting user litter report:", error);
    return { data: null, error };
  }

  return { data: true, error: null };
}





//crud ops for litter summary

export interface UserLitterSummary {
  id?: string;
  user_id: string;
  total_items: number;
  average_accuracy: number;
  last_updated?: string | null;
}

export interface UserLitterSummaryInsert {
  user_id: string;
  total_items: number;
  average_accuracy: number;
}

export interface UserLitterSummaryUpdate {
  total_items?: number;
  average_accuracy?: number;
}

//create - insert a new litter summary
export async function createUserLitterSummary(data: UserLitterSummaryInsert) {
  const { data: result, error } = await supabase
    .from('user_litter_summary')
    .insert({
      ...data,
      last_updated: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user litter summary:", error);
    return { data: null, error };
  }

  return { data: result, error: null };
}
//upsert litter summary
export async function upsertUserLitterSummary(data: UserLitterSummaryUpdate) {
  const { data: result, error } = await supabase
    .from('user_litter_summary')
    .upsert({
      ...data,
      last_updated: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user litter summary:", error);
    return { data: null, error };
  }

  return { data: result, error: null };
}





// CREATE OR UPDATE - Upsert litter summary (since user_id is unique)

//get litter summaries for the specific user
export async function getUserLitterSummaries(userId:string){
    const { data, error } = await supabase
    .from('user_litter_summary')
    .select('*')
    .eq('user_id', userId);

    if (error) {
        console.error("Error fetching user litter summaries:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

// READ - Get all litter summaries (for admin purposes)
export async function getAllLitterSummaries() {
  const { data, error } = await supabase
    .from('user_litter_summary')
    .select('*')
    .order('total_items', { ascending: false });

  if (error) {
    console.error("Error fetching all litter summaries:", error);
    return { data: [], error };
  }

  return { data, error: null };
}

//update - update litter summary
export async function updateUserLitterSummary(userId: string, updates: UserLitterSummaryUpdate){
    const{data, error} = await supabase
    .from('user_litter_summary')
    .update({
        ...updates,
        last_updated: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

    if (error) {
        console.error("Error updating user litter summary:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

//delete - delete litter summary

export async function deleteUserLitterSummary(userId:string){
    const {error} = await supabase.
    from('user_litter_summary')
    .delete()
    .eq('user_id', userId)

    if(error){
        console.error("Error deleting user litter summary:", error)
        return {data:null, error};
    }
}


//postgREST for user_quiz_report
export interface UserQuizReport{
    id:string;
    created_at : string;
    user_id : string | null;
    correct_answers: number|null
}

export interface UserQuizReportInsert{
    user_id? : string | null;
    correct_answers? : number|null;
}

export interface UserQuizReportUpdate{
    correct_answers? : number | null
}

//CREATE - Insert a new quiz report

export async function createUserQuizReport(data:UserQuizReportInsert){
    const { data: result, error } = await supabase
    .from('user_quiz_report')
    .insert({
        ...data,
    })
    .select()
    .single();

    if (error) {
        console.error("Error creating user quiz report:", error);
        return { data: null, error };
    }

    return { data: result, error: null };
}

//Read - get all quiz reports for a specific user

export async function getUserQuizReports(userId:string){
    const {data, error} = await supabase
    .from('user_quiz_report')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending:false})

    if(error){
        console.error("Error fetching user quiz reports", error)
        return {data:[], error}
    }

    return {data, error:null}
}


export async function updateUserQuizReport(id:string, updates:UserQuizReportUpdate){
    const {data, error} = await supabase
    .from('user_quiz_report')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

    if(error){
        console.error("Error updating user quiz report:", error)
        return {data:null, error};
    }

    return {data, error:null}

}

//Delete - delete a quiz report by id
export async function deleteUserQuizReport(id:string){
    const {error} = await supabase
    .from('user_quiz_report')
    .delete()
    .eq('id', id)

    if(error){
        console.error("Error deleting user quiz report:", error)
        return {data:null, error};
    }

    return {data: true, error:null};
}

//postgREST for CarbonClash
export async function persistQuizReport(userId: string, quiz_correct_answers: number){
    // First, check if user statistics record exists
    const { data: existingRecord, error: fetchError } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error checking existing user statistics:", fetchError);
        return { data: null, error: fetchError };
    }

    let result;
    if (existingRecord) {
        // Update existing record - ADD to existing quiz_correct_answers
        const newTotal = (existingRecord.quiz_correct_answers || 0) + quiz_correct_answers;
        result = await supabase
            .from('user_statistics')
            .update({ 
                quiz_correct_answers: newTotal,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .select();
    } else {
        // Create new record with just the required fields
        result = await supabase
            .from('user_statistics')
            .insert({ 
                user_id: userId,
                quiz_correct_answers: quiz_correct_answers,
                updated_at: new Date().toISOString()
            })
            .select();
    }

    if (result.error) {
        console.error("Error persisting quiz report:", result.error);
        return { data: null, error: result.error };
    }

    return { data: result.data, error: null };
}


//Carbon Tracker postgREST functions

export interface CarbonActivity{
    id:string;
    user_id:string;
    type:string;
    date:string;
    quantity:number;
    carbon_saved:number;
    created_at?:string|null;
    updated_at?:string|null;
}

export interface CarbonActivityInsert{
    user_id:string;
    type:string;
    date?:string;
    quantity:number;
    carbon_saved:number;

}

export interface CarbonActivityUpdate{
    type?:string;
    date?:string;
    quantity?:number;
    carbon_saved?:number;
}

//Create - insert a new carbon activity
export async function createCarbonActivity(data:CarbonActivityInsert){
    const {data:result, error} = await supabase
    .from('carbon_activities')
    .insert(data)
    .select()
    .single();
    if(error){
        console.error("Error creating carbon activity", error)
        return {data:null, error}
    }
    return {data:result, error:null}
}

//Read - get all carbon activities for a specific user
export async function getUserCarbonActivities(userId:string){
    const {data, error} = await supabase
    .from('carbon_activities')
    .select('*')
    .eq('user_id', userId )
    .order('date', {ascending:false});
    if(error){
        console.error("Error fetching user carbon activities", error)
        return {data:[], error}
    }
    return {data, error:null}
}

//Read-get Carbon activities by date range

export async function getCarbonActivitiesByDateRange(userId:string, startDate:string, endDate:string){
    const {data, error} = await supabase
    .from('carbon_activities')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', {ascending:false});
    if(error){
        console.error("Error fetching carbon activities by date range", error)
        return {data:[], error}
    }
    return {data, error:null}
}

//Read - get total carbon saved for user
export async function getTotalCarbonSaved(userId: string) {
  const { data, error } = await supabase
    .from('carbon_activities')
    .select('carbon_saved')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching total carbon saved:", error);
    return { data: 0, error };
  }

  const total = data.reduce((sum, activity) => sum + activity.carbon_saved, 0);
  return { data: total, error: null };
}


//Get monthly carbon savings
export async function updateCarbonActivity(id: string, updates: CarbonActivityUpdate) {
  const { data, error } = await supabase
    .from('carbon_activities')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating carbon activity:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deleteCarbonActivity(id: string) {
  const { error } = await supabase
    .from('carbon_activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting carbon activity:", error);
    return { data: null, error };
  }

  return { data: true, error: null };
}

//postgREST for Calendar Tracker
export interface EcoEvent {
  id: number;
  date: string;
  title: string;
  time: string;
  location: string;
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar';
  description: string;
  participants: number;
  max_participants: number;
  created_at?: string | null;
  updated_at?: string | null;
}


export interface EcoEventInsert {
  date: string;
  title: string;
  time: string;
  location: string;
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar';
  description: string;
  participants?: number;
  max_participants: number;
}

export interface EcoEventUpdate {
  date?: string;
  title?: string;
  time?: string;
  location?: string;
  category?: 'cleanup' | 'workshop' | 'planting' | 'seminar';
  description?: string;
  participants?: number;
  max_participants?: number;


}

//Create - Insert a new eco event
export async function createEcoEvent(data:EcoEventInsert){
    const {data:result, error} = await supabase
    .from('eco_events')
    .insert(data)
    .select()
    .single();

    if(error){
        console.error("Error creating eco event", error)
        return {data:null, error}
    }

    return {data:result, error:null}
}

//Read - get all eco events

export async function getEcoEvents(){
    const {data, error} = await supabase
    .from('eco_events')
    .select('*')
    .order('date', {ascending:true});


    if(error){
        console.error("Error fetching eco events", error);
        return {data : [], error};
    }
    return{data, error:null}
}

// Alias for backward compatibility
export const getAllEcoEvent = getEcoEvents;

//Read - get eco event by id
export async function getEcoEventById(id:number){

    const {data, error} = await supabase
    .from('eco_events')
    .select('*')
    .eq('id', id)
    .single();
    if(error){
        console.error("Error fetching eco event:", error)
        return {data:null, error}
    }
    return {data, error:null}

}

//Read - get eco events by date

export async function getEcoEventsByDate(date:string){
    const {data, error} = await supabase
    .from('eco_events')
    .select('*')
    .eq('date', date)
    .order('time', {ascending:true});

    if(error){
        console.error("Error fetching eco events by date:", error)
        return {data:[], error};
    }

    return {data, error:null}


}

//read - get eco events by month

export async function getEcoEventsByMonth(year:number, month:number){
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).getDate(); // Get actual last day of month
  const endDateString = `${year}-${month.toString().padStart(2, '0')}-${endDate.toString().padStart(2, '0')}`;

  const{data, error} = await supabase
  .from("eco_events")
  .select('*')
  .gte('date', startDate)
  .lte('date', endDateString)
  .order('date', {ascending:true});

  if(error){
    console.error("Error fetching eco events by month:", error);
    console.error("Query details:", { startDate, endDateString, year, month }); // Debug info
    return {data:[], error};
  }

  return {data, error:null};
}

//Read - get eco events by category
export async function getEcoEventsByCategory(category: 'cleanup' | 'workshop' | 'planting' | 'seminar') {
  const { data, error } = await supabase
    .from('eco_events')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching eco events by category:", error);
    return { data: [], error };
  }

  return { data, error: null };
}

//READ - get upcoming eco events
export async function getUpcomingEvents(){
    const today = new Date().toISOString().split('T')[0];

    const {data, error} = await supabase.
    from("eco_events")
    .select('*')
    .gte('date', today)
    .order('date', {ascending:true});

    if(error){
        console.error("error fetching eco events", error);
        return {data:[], error};
    }
    return {data, error:null}
}

// UPDATE - update eco event
export async function updateEcoEvent(id: number, updates: EcoEventUpdate) {
    console.log("=== UPDATE ECO EVENT DEBUG ===");
    console.log("Event ID:", id, "Type:", typeof id);
    console.log("Updates:", updates);
    
    // First verify the event exists
    const { data: existingEvent, error: checkError } = await supabase
        .from('eco_events')
        .select('*')
        .eq('id', id);
        
    console.log("Check query result:", { data: existingEvent, error: checkError });
        
    if (checkError) {
        console.error("Error checking for event:", checkError);
        return { data: null, error: checkError };
    }
    
    if (!existingEvent || existingEvent.length === 0) {
        console.error("Event not found with ID:", id);
        return { data: null, error: new Error(`Event ${id} not found`) };
    }
    
    console.log("Found event to update:", existingEvent[0]);
    
    // Now update
    const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString()
    };
    
    console.log("Update payload:", updatePayload);
    
    const { data: result, error } = await supabase
        .from('eco_events')
        .update(updatePayload)
        .eq('id', id)
        .select();

    console.log("Update result:", { data: result, error });

    if (error) {
        console.error("Error updating eco event:", error);
        return { data: null, error };
    }

    // Check if the update actually worked by querying again
    const { data: updatedEvent, error: selectError } = await supabase
        .from('eco_events')
        .select('*')
        .eq('id', id);
        
    console.log("Post-update verification:", { data: updatedEvent, error: selectError });

    if (selectError) {
        console.error("Error verifying update:", selectError);
        return { data: null, error: selectError };
    }

    if (!updatedEvent || updatedEvent.length === 0) {
        console.error("Event disappeared after update - this is very strange");
        return { data: null, error: new Error("Event not found after update") };
    }

    // Even if the update query didn't return data, if we can select the updated event successfully,
    // consider it a success
    console.log("Successfully updated event (verified):", updatedEvent[0]);
    return { data: updatedEvent[0], error: null };
}

// UTILITY - Search eco events




export async function checkUserEventParticipation(eventId:number, userId:string):Promise<boolean>{
    try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking participation:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking user participation:', error);
    return false;
  }
}

//Join an event (add user to participants)
export async function joinEcoEvent(eventId:number, userId:string ):Promise<{success:boolean; message : string}>{
    try {
    console.log('=== JOIN EVENT DEBUG ===');
    console.log('Event ID:', eventId, 'User ID:', userId);

    // First check if user is already registered
    const alreadyJoined = await checkUserEventParticipation(eventId, userId);
    if (alreadyJoined) {
      return { success: false, message: 'You have already joined this event' };
    }

    // Check if event exists and has space
    const { data: event, error: eventError } = await supabase
      .from('eco_events')
      .select('participants, max_participants')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error fetching event:', eventError);
      return { success: false, message: 'Event not found' };
    }

    if (event.participants >= event.max_participants) {
      return { success: false, message: 'Event is full' };
    }

    // Add user to event participants
    const { error: insertError } = await supabase
      .from('event_participants')
      .insert([{ event_id: eventId, user_id: userId }]);

    if (insertError) {
      console.error('Error joining event:', insertError);
      return { success: false, message: 'Failed to join event' };
    }

    console.log('Successfully joined event');
    return { success: true, message: 'Successfully joined event!' };
  } catch (error) {
    console.error('Error in joinEcoEvent:', error);
    return { success: false, message: 'An error occurred' };
  }
}; 

export async function leaveEcoEvent(eventId: number, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving event:', error);
      return { success: false, message: 'Failed to leave event' };
    }

    return { success: true, message: 'Successfully left event!' };
  } catch (error) {
    console.error('Error in leaveEcoEvent:', error);
    return { success: false, message: 'An error occurred' };
  }
}
export async function getEcoEventsWithParticipation(userId?: string): Promise<(EcoEvent & { userJoined: boolean })[]> {
  try {
    const query = supabase
      .from('eco_events')
      .select(`
        *,
        event_participants!inner(user_id)
      `);

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    // Add userJoined status to each event
    const eventsWithStatus = events?.map(event => ({
      ...event,
      userJoined: userId ? event.event_participants?.some((p: any) => p.user_id === userId) : false
    })) || [];

    return eventsWithStatus;
  } catch (error) {
    console.error('Error in getEcoEventsWithParticipation:', error);
    return [];
  }
}

// Dashboard metrics functions

// 1. Events This Month - Get count of eco_events for current month
export async function getEventsThisMonth(): Promise<{ count: number; error: any }> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    const { count, error } = await supabase
      .from('eco_events')
      .select('*', { count: 'exact', head: true })
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching events this month:', error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error in getEventsThisMonth:', error);
    return { count: 0, error };
  }
}

// 2. Total Participants - Get total participants from event_participants table
export async function getTotalParticipants(): Promise<{ count: number; error: any }> {
  try {
    const { count, error } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total participants:', error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error in getTotalParticipants:', error);
    return { count: 0, error };
  }
}

// 3. Events Joined - Count events a specific user has joined
export async function getEventsJoinedByUser(userId: string): Promise<{ count: number; error: any }> {
  try {
    if (!userId) {
      return { count: 0, error: null };
    }

    const { count, error } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching events joined by user:', error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error in getEventsJoinedByUser:', error);
    return { count: 0, error };
  }
}

// Combined dashboard metrics function
export async function getDashboardMetrics(userId?: string): Promise<{
  eventsThisMonth: number;
  totalParticipants: number;
  eventsJoined: number;
  error: any;
}> {
  try {
    // Run all queries in parallel for better performance
    const [eventsResult, participantsResult, joinedResult] = await Promise.all([
      getEventsThisMonth(),
      getTotalParticipants(),
      userId ? getEventsJoinedByUser(userId) : Promise.resolve({ count: 0, error: null })
    ]);

    // Check if any queries failed
    const hasError = eventsResult.error || participantsResult.error || joinedResult.error;
    
    if (hasError) {
      console.error('Error in dashboard metrics:', {
        eventsError: eventsResult.error,
        participantsError: participantsResult.error,
        joinedError: joinedResult.error
      });
    }

    return {
      eventsThisMonth: eventsResult.count,
      totalParticipants: participantsResult.count,
      eventsJoined: joinedResult.count,
      error: hasError
    };
  } catch (error) {
    console.error('Error in getDashboardMetrics:', error);
    return {
      eventsThisMonth: 0,
      totalParticipants: 0,
      eventsJoined: 0,
      error
    };
  }
}


export interface UnifiedEvent {
  id: number;
  date: string;
  title: string;
  time: string;
  location: string;
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar';
  description: string;
  participants: number;
  max_participants: number;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
  event_type?: string | null;
  duration?: string | null;
  location_name?: string | null;
  location_address?: string | null;
  lat?: number | null;
  lng?: number | null;
  organizer?: string | null;
  status?: string | null;
  equipment_provided?: string[] | null;
  requirements?: string[] | null;
  expected_trash_collection?: string | null;
  carbon_offset?: string | null;
  is_litter_analysis_report?: boolean | null;
}


export interface UnifiedEventInsert {
  date: string;
  title: string;
  time: string;
  location: string;
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar';
  description: string;
  participants?: number;
  max_participants: number;
  user_id?: string;
  duration?: string;
  location_name?: string;
  location_address?: string;
  lat?: number;
  lng?: number;
  organizer?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  equipment_provided?: string[];
  requirements?: string[];
  expected_trash_collection?: string;
  carbon_offset?: string;
  is_litter_analysis_report?: boolean;
}


export async function getAllUnifiedEvents(): Promise<{ data: UnifiedEvent[] | null; error: any }> {
  try{
    const {data, error} = await supabase.
    from('eco_events')
    .select('*')
    .order('date', {ascending:true});


    if(error) throw error;
    return {data, error:null}
  }


  catch(error){
    return {data:null, error}
  }
}





//Get events by month(for calendar view)
// Get events by month (for calendar view)
export async function getUnifiedEventsByMonth(year: number, month: number): Promise<{ data: UnifiedEvent[] | null; error: any }> {
  try {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const endDateString = `${year}-${month.toString().padStart(2, '0')}-${endDate.toString().padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('eco_events')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDateString)
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

//Get upcoming events (for Both UIs)
export async function getUpcomingUnifiedEvents(): Promise<{ data: UnifiedEvent[] | null; error: any }> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('eco_events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createUnifiedEvent(eventData: UnifiedEventInsert): Promise<{ data: UnifiedEvent | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('eco_events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}


export async function joinUnifiedEvent(eventId: number, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: existing } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return { success: false, message: 'Already joined' };
    }

    const { data: event } = await supabase
      .from('eco_events')
      .select('participants, max_participants')
      .eq('id', eventId)
      .single();

    if (event && event.participants >= event.max_participants) {
      return { success: false, message: 'Event full' };
    }

    const { error } = await supabase
      .from('event_participants')
      .insert([{ event_id: eventId, user_id: userId }]);

    if (error) throw error;
    return { success: true, message: 'Joined successfully!' };
  } catch (error) {
    console.error('Error joining event:', error);
    return { success: false, message: 'Failed to join' };
  }
}


export async function leaveUnifiedEvent(eventId: number, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, message: 'Left successfully!' };
  } catch (error) {
    console.error('Error leaving event:', error);
    return { success: false, message: 'Failed to leave event' };
  }


}


export async function getDashboardMetricsUnified(userId?: string): Promise<{
  eventsThisMonth: number;
  totalParticipants: number;
  eventsJoined: number;
  error: any;
}> {
  try {
    const [eventsResult, participantsResult, joinedResult] = await Promise.all([
      getEventsThisMonth(), // Uses existing function (gets all events)
      getTotalParticipants(), // Uses existing function (gets all participants)
      userId ? getEventsJoinedByUser(userId) : Promise.resolve({ count: 0, error: null })
    ]);

    const hasError = eventsResult.error || participantsResult.error || joinedResult.error;
    
    return {
      eventsThisMonth: eventsResult.count,
      totalParticipants: participantsResult.count,
      eventsJoined: joinedResult.count,
      error: hasError
    };
  } catch (error) {
    console.error('Error in getDashboardMetricsUnified:', error);
    return {
      eventsThisMonth: 0,
      totalParticipants: 0,
      eventsJoined: 0,
      error
    };
  }
}



