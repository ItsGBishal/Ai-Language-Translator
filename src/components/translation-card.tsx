"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LanguageSelector } from "@/components/language-selector";
import { LANGUAGES } from "@/lib/languages";
import { translateText } from "@/ai/flows/translate-text";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Copy, Languages, Loader2, Share2, AlertCircle, Globe } from "lucide-react";

export function TranslationCard() {
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("es");
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    if (sourceLanguage === targetLanguage) {
      setError("Source and target languages cannot be the same.");
      setTranslatedText(inputText); // Or clear translated text
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedText("");

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: LANGUAGES.find(l => l.value === sourceLanguage)?.label || sourceLanguage,
        targetLanguage: LANGUAGES.find(l => l.value === targetLanguage)?.label || targetLanguage,
      });
      setTranslatedText(result.translatedText);
    } catch (e) {
      console.error("Translation error:", e);
      setError("Failed to translate text. Please try again.");
      setTranslatedText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        toast({ title: "Copied!", description: "Translated text copied to clipboard." });
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to copy text." });
      });
  };

  const handleShare = () => {
    if (!translatedText) return;
    if (navigator.share) {
      navigator.share({
        title: "Translated Text",
        text: translatedText,
      })
      .then(() => console.log("Shared successfully"))
      .catch((err) => {
        console.error("Share failed:", err);
        // Fallback to copy if share fails or is cancelled by user
        handleCopy();
        toast({ title: "Share failed", description: "Text copied to clipboard instead.", variant: "default" });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopy();
      toast({ title: "Share not supported", description: "Text copied to clipboard instead." });
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    // Optionally swap inputText and translatedText if it makes sense for user flow
    // const tempText = inputText;
    // setInputText(translatedText);
    // setTranslatedText(tempText);
  };

  // Clear error when inputs change
  useEffect(() => {
    if (error) setError(null);
  }, [inputText, sourceLanguage, targetLanguage]);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-primary">
          <Globe className="h-7 w-7" /> LinguaLive Translator
        </CardTitle>
        <CardDescription>
          Enter text, select your languages, and let AI bridge the communication gap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            languages={LANGUAGES}
            placeholder="Source Language"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapLanguages}
            aria-label="Swap languages"
            className="text-accent hover:text-accent-foreground hover:bg-accent/10 transition-colors"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            languages={LANGUAGES}
            placeholder="Target Language"
          />
        </div>

        <div>
          <Label htmlFor="input-text" className="text-foreground/80">Enter text to translate</Label>
          <Textarea
            id="input-text"
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            className="mt-1 text-base focus:ring-accent"
          />
        </div>

        <Button onClick={handleTranslate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Languages className="mr-2 h-5 w-5" />
          )}
          Translate
        </Button>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertTitle className="font-semibold text-destructive">Translation Error</AlertTitle>
            <AlertDescription className="text-destructive/90">{error}</AlertDescription>
          </Alert>
        )}

        {(translatedText || isLoading) && (
          <div className="space-y-2">
            <Label htmlFor="translated-text" className="text-foreground/80">Translated text</Label>
            {isLoading && !translatedText && (
                 <div className="flex items-center justify-center p-3 rounded-md border border-dashed bg-muted min-h-[120px] text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> Translating...
                 </div>
            )}
            {translatedText && !isLoading && (
              <div
                id="translated-text"
                className="p-3 rounded-md border bg-secondary/50 min-h-[120px] whitespace-pre-wrap text-base text-secondary-foreground shadow-inner"
              >
                {translatedText}
              </div>
            )}
            {!isLoading && translatedText && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-accent border-accent hover:bg-accent/10 hover:text-accent-foreground">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                {typeof navigator !== 'undefined' && navigator.share && (
                    <Button variant="outline" size="sm" onClick={handleShare} className="text-accent border-accent hover:bg-accent/10 hover:text-accent-foreground">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
