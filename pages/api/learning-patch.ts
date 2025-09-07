import type { NextApiRequest, NextApiResponse } from "next";

interface YouTubeSearchItem {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
    };
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req:NextApiRequest, res: NextApiResponse){

    // Generic sustainability content 
    const educationalSustainabilityQueries = [
        "sustainability",
        "eco friendly",
        "climate change", 
        "renewable energy",
        "environment",
        "green living",
        "zero waste",
        "recycling",
        "carbon footprint",
        "sustainable living",
        "going green",
        "clean energy",
        "biodiversity",
        "conservation",
        "eco tips",
        "environmental protection",
        "green technology",
        "eco lifestyle",
        "nature conservation",
        "environmental awareness",
        "climate action",
        "green energy",
        "eco friendly tips",
        "sustainable fashion",
        "plastic pollution"
    ];

    const randomQuery = educationalSustainabilityQueries[Math.floor(Math.random() * educationalSustainabilityQueries.length)];
    const query = req.query.q || randomQuery;
    const maxResults = Math.min(parseInt(req.query.maxResults as string) || 25, 50); // Fetch more to filter better

    // Focus on educational content with better parameters
    const randomOrder = Math.random() > 0.3 ? 'relevance' : 'rating'; // Prefer quality content
    const safeSearch = 'strict'; // Enable strict safe search
    const regionCode = 'US'; // Focus on US content
    
    // Add content filtering parameters
    const videoEmbeddable = 'true'; // Only embeddable videos
    const videoSyndicated = 'true'; // Only syndicated videos (higher quality)
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query as string
    )}&type=video&videoDuration=short&maxResults=${maxResults}&order=${randomOrder}&safeSearch=${safeSearch}&regionCode=${regionCode}&videoEmbeddable=${videoEmbeddable}&videoSyndicated=${videoSyndicated}&key=${GOOGLE_API_KEY}`;

    try{
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ error: "No videos found" });
        }

        // Filter for educational content
        const filteredItems = data.items.filter((item: YouTubeSearchItem) => {
            const title = item.snippet.title.toLowerCase();
            const description = item.snippet.description.toLowerCase();
            const channelTitle = item.snippet.channelTitle.toLowerCase();
            
            // STRICT: Only sustainability/environmental keywords allowed
            const educationalKeywords = [
                'sustainability', 'sustainable', 'eco', 'environment', 'environmental',
                'green', 'climate', 'renewable', 'energy', 'conservation', 'nature',
                'recycle', 'recycling', 'waste', 'zero waste', 'carbon', 'footprint',
                'biodiversity', 'ecosystem', 'pollution', 'clean', 'organic',
                'tips', 'how to', 'ways to', 'reduce', 'reuse', 'save',
                'protect', 'earth', 'planet', 'wildlife', 'forest', 'ocean'
            ];
            
            // EXPANDED: Block ALL irrelevant content
            const inappropriateKeywords = [
                // Entertainment/Social media
                'prank', 'drama', 'gossip', 'viral', 'crazy', 'shocking', 'weird',
                'cringe', 'roast', 'diss', 'beef', 'exposed', 'tea', 'shade',
                'funny', 'comedy', 'joke', 'laugh', 'lol', 'wtf', 'omg', 'epic',
                'reaction', 'react', 'tiktok', 'trend', 'challenge', 'meme',
                'dance', 'song', 'music', 'rap', 'beat', 'remix', 'cover',
                
                // Personal/lifestyle (not environmental)
                'dating', 'relationship', 'boyfriend', 'girlfriend', 'crush',
                'party', 'night out', 'weekend', 'vacation', 'travel vlog',
                'outfit', 'fashion', 'makeup', 'hair', 'skincare', 'beauty',
                'workout', 'gym', 'fitness', 'diet', 'food', 'cooking', 'recipe',
                'gaming', 'game', 'play', 'stream', 'twitch', 'discord',
                
                // Inappropriate themes
                'sexy', 'hot', 'drunk', 'alcohol', 'smoking', 'drugs', 'weed',
                'money', 'rich', 'expensive', 'luxury', 'brand', 'shopping',
                'celebrity', 'famous', 'star', 'influencer', 'tiktoker',
                
                // Controversial/divisive
                'politics', 'political', 'government', 'protest', 'activist',
                'controversy', 'debate', 'argument', 'fight', 'angry', 'hate',
                'attack', 'destroy', 'slam', 'blast', 'criticism', 'outrage',
                
                // Clickbait indicators
                'clickbait', 'shocking', 'insane', 'crazy', 'unbelievable',
                'you wont believe', 'amazing', 'incredible', 'mind blown'
            ];
            
            // ONLY environmental/sustainability terms allowed
            const generalTerms = [
                'earth', 'planet', 'world', 'future', 'change', 'impact',
                'life', 'living', 'home', 'community', 'together'
            ];
            
            // STRICT CHECK: Must have sustainability keywords
            const hasSustainabilityContent = educationalKeywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword)
            );
            
            // Check for environmental themes in general terms
            const hasEnvironmentalTheme = generalTerms.some(term =>
                title.includes(term) || description.includes(term)
            );
            
            // STRICT: Block ALL inappropriate content
            const hasInappropriateContent = inappropriateKeywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword) || channelTitle.includes(keyword)
            );
            
            // Additional safety checks
            const hasPoliticalContent = title.includes('political') || description.includes('political') ||
                                       title.includes('government') || description.includes('government');
                                       
            const hasControversialContent = ['controversial', 'debate', 'argument'].some(word =>
                title.includes(word) || description.includes(word)
            );
            
            // Check video length indicator (avoid very short meme-style content)
            const seemsLowQuality = title.length < 20 || 
                                   (title.match(/[!?]/g) || []).length > 2 ||
                                   title.includes('😱') || title.includes('🤯') ||
                                   title.toUpperCase() === title; // ALL CAPS titles
            
            // ONLY verified environmental/educational channels
            const educationalChannels = [
                'national geographic', 'bbc earth', 'discovery', 'nature',
                'wildlife', 'planet earth', 'nova', 'smithsonian',
                'animal planet', 'nat geo', 'david attenborough',
                'wwf', 'greenpeace', 'sierra club', 'conservation international',
                'environmental protection', 'climate change', 'sustainability',
                'renewable energy', 'clean energy', 'green technology'
            ];
            
            // ONLY trusted environmental creators
            const trustedCreators = [
                'bill nye', 'neil degrasse', 'david attenborough',
                'jane goodall', 'greta thunberg', 'al gore'
            ];
            
            const isEnvironmentalChannel = educationalChannels.some(channel => 
                channelTitle.includes(channel)
            ) || trustedCreators.some(creator => 
                channelTitle.includes(creator)
            );
            
            // SUPER STRICT: Must be directly about sustainability AND no bad content
            const isRelevantContent = hasSustainabilityContent || isEnvironmentalChannel;
            const isBadContent = hasInappropriateContent || hasPoliticalContent || hasControversialContent || seemsLowQuality;
            
            return isRelevantContent && !isBadContent;
        });

        if (filteredItems.length === 0) {
            return res.status(404).json({ error: "No good videos found" });
        }

        let videoLinks = filteredItems.map((item: YouTubeSearchItem) => `https://www.youtube.com/shorts/${item.id.videoId}`);
        
        // Shuffle the results for more randomness
        videoLinks = videoLinks.sort(() => Math.random() - 0.5);
        
        // Return only 6-10 videos to keep it manageable for teens
        const finalCount = Math.min(videoLinks.length, 6 + Math.floor(Math.random() * 5));
        videoLinks = videoLinks.slice(0, finalCount);

        res.status(200).json(videoLinks);
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
        res.status(500).json({ error: "Failed to fetch YouTube data" });
    }

}