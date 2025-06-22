import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { convertUrlSchema, type ConvertUrlRequest, type SpotifyTrackInfo } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SiYoutubemusic } from "react-icons/si";
import { Loader2 } from "lucide-react";
import ResultCard from "./result-card";

export default function ConversionForm() {
  const [spotifyResult, setSpotifyResult] = useState<SpotifyTrackInfo | null>(null);
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

  const onSubmit = (data: ConvertUrlRequest) => {
    convertMutation.mutate(data);
  };

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

              <Button
                type="submit"
                disabled={convertMutation.isPending}
                className="w-full bg-spotify hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {convertMutation.isPending ? (
                  <>
                    Converting...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Convert to Spotify"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {spotifyResult && <ResultCard result={spotifyResult} />}
    </>
  );
}
