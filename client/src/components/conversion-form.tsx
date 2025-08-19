import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { convertUrlSchema, type ConvertUrlRequest, type SpotifyTrackInfo, type YouTubeTrackInfo } from "../../../shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SiYoutubemusic } from "react-icons/si";
import { Loader2, Music, AlertCircle } from "lucide-react";
import ResultCard from "./result-card";

export default function ConversionForm() {
  const [spotifyResult, setSpotifyResult] = useState<SpotifyTrackInfo | null>(null);
  const [youtubePreview, setYoutubePreview] = useState<YouTubeTrackInfo | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<ConvertUrlRequest>({
    resolver: zodResolver(convertUrlSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (data: ConvertUrlRequest) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return await response.json() as SpotifyTrackInfo;
    },
    onSuccess: (result) => {
      setSpotifyResult(result);

      // Store the successfully processed URL
      setLastProcessedUrl(form.getValues("youtubeUrl"));
        
      toast({
        title: "Success!",
        description: "Successfully converted to Spotify!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Conversion Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch YouTube track preview when URL changes
  const fetchYouTubePreview = async (url: string) => {
    if (!url || !convertUrlSchema.safeParse({ youtubeUrl: url }).success) {
      setYoutubePreview(null);
      return;
    }

    setIsLoadingPreview(true);
    try {
      const response = await apiRequest("POST", "/api/youtube-info", { youtubeUrl: url });
      const data = await response.json() as YouTubeTrackInfo;
      setYoutubePreview(data);
    } catch (error) {
      setYoutubePreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Watch for URL changes
  const watchedUrl = form.watch("youtubeUrl");
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedUrl !== previousUrl) {
        if (watchedUrl && watchedUrl.trim() !== "") {
          fetchYouTubePreview(watchedUrl);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedUrl, previousUrl]);

  const isButtonEnabled = watchedUrl && 
    watchedUrl.trim() !== "" && 
    !convertMutation.isPending && 
    watchedUrl !== previousUrl;

  const onSubmit = (data: ConvertUrlRequest) => {
    convertMutation.mutate(data);
  };

  // Check if the current URL is the same as the last processed URL
  const isDuplicateUrl = lastProcessedUrl && watchedUrl === lastProcessedUrl;
  
  // Check if the form is valid and not a duplicate
  const isFormValid = form.formState.isValid && !isDuplicateUrl;

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg mb-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      YouTube Music URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://music.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spotify focus:border-spotify transition-colors duration-200 pr-10"
                        />
                        <SiYoutubemusic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-youtube opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duplicate URL warning */}
              {isDuplicateUrl && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    This URL has already been converted. Enter a different YouTube Music URL to convert.
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={convertMutation.isPending || !isFormValid}
                className="w-full bg-spotify hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {convertMutation.isPending ? (
                  <>
                    Converting...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : isDuplicateUrl ? (
                  "URL Already Converted"
                ) : (
                  "Convert to Spotify"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* YouTube Track Preview */}
      {youtubePreview && (
        <Card className="bg-white rounded-2xl shadow-lg mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <SiYoutubemusic className="text-youtube text-xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">YouTube Track Preview</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-4">
              <img 
                src={youtubePreview.thumbnailUrl} 
                alt="YouTube thumbnail"
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {youtubePreview.trackName}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {youtubePreview.artistName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Original: {youtubePreview.originalTitle}
                </p>
              </div>
              {isLoadingPreview && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {spotifyResult && <ResultCard result={spotifyResult} />}
    </>
  );
}
