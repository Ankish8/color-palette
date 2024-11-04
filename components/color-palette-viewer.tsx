'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush, Check, Sun, Moon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColorShade {
  [key: string]: string;
}

interface ColorSet {
  name: string;
  base: string;
  shades: ColorShade;
  usage: string;
}

interface ColorCategory {
  title: string;
  colors: ColorSet[];
}

interface ColorPalettes {
  [key: string]: ColorCategory;
}

interface ColorPaletteProps {
  colorPalettes?: ColorPalettes;
  title?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function calculateLuminance(rgb: { r: number, g: number, b: number }) {
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;

  const luminance1 = calculateLuminance(rgb1);
  const luminance2 = calculateLuminance(rgb2);

  const ratio = luminance1 > luminance2 
    ? (luminance1 + 0.05) / (luminance2 + 0.05)
    : (luminance2 + 0.05) / (luminance1 + 0.05);

  return Math.round(ratio * 100) / 100;
}

function getComplementaryColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  const complement = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  };
  return rgbToHex(complement);
}

function getAnalogousColors(hex: string) {
  const hsl = hexToHsl(hex);
  const analogous1 = { ...hsl, h: (hsl.h + 30) % 360 };
  const analogous2 = { ...hsl, h: (hsl.h + 330) % 360 };
  return [hslToHex(analogous1), hslToHex(analogous2)];
}

function getTriadicColors(hex: string) {
  const hsl = hexToHsl(hex);
  const triadic1 = { ...hsl, h: (hsl.h + 120) % 360 };
  const triadic2 = { ...hsl, h: (hsl.h + 240) % 360 };
  return [hslToHex(triadic1), hslToHex(triadic2)];
}

function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: { h: number, s: number, l: number }) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function rgbToHex({ r, g, b }: { r: number, g: number, b: number }) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

async function getColorName(hex: string): Promise<string> {
  try {
    const response = await fetch(`https://api.color.pizza/v1/${hex.replace('#', '')}`);
    const data = await response.json();
    return data.colors[0].name;
  } catch (error) {
    console.error('Error fetching color name:', error);
    return 'Unknown';
  }
}

function getColorCombinations(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const complementary = hslToHex({ ...hsl, h: (hsl.h + 180) % 360 });
  const triadic1 = hslToHex({ ...hsl, h: (hsl.h + 120) % 360 });
  const triadic2 = hslToHex({ ...hsl, h: (hsl.h + 240) % 360 });
  const analogous1 = hslToHex({ ...hsl, h: (hsl.h + 30) % 360 });
  const analogous2 = hslToHex({ ...hsl, h: (hsl.h + 330) % 360 });
  
  return [complementary, triadic1, triadic2, analogous1, analogous2];
}

export default function ColorPaletteViewer({ 
  colorPalettes = {
    primary: {
      title: "Primary Colors",
      colors: [
        {
          name: 'Royal Purple',
          base: '#460E2F',
          shades: {
            50: '#FCF5F8',
            100: '#F5D9E5',
            200: '#E8B3CC',
            300: '#D98DB3',
            400: '#A03D6B',
            500: '#460E2F',
            600: '#3D0C28',
            700: '#340A22',
            800: '#2B081C',
            900: '#220615'
          },
          usage: 'Primary brand color, headers, icons'
        }
      ]
    },
    secondary: {
      title: "Secondary Colors",
      colors: [
        {
          name: 'Sunset Orange',
          base: '#F68B29',
          shades: {
            50: '#FEF6EC',
            100: '#FDE7CC',
            200: '#FBCE99',
            300: '#F9B566',
            400: '#F7A143',
            500: '#F68B29',
            600: '#E17311',
            700: '#BC600E',
            800: '#964D0B',
            900: '#713A09'
          },
          usage: 'Call-to-action buttons, highlights'
        }
      ]
    },
    accent: {
      title: "Accent Colors",
      colors: [
        {
          name: 'Forest Green',
          base: '#2A5A3B',
          shades: {
            50: '#F5F9F6',
            100: '#DCE8DF',
            200: '#B9D1C0',
            300: '#96BAA1',
            400: '#73A382',
            500: '#2A5A3B',
            600: '#244D32',
            700: '#1E4029',
            800: '#183320',
            900: '#122617'
          },
          usage: 'Nature elements, sustainability themes'
        },
        {
          name: 'Ocean Blue',
          base: '#1B4B7A',
          shades: {
            50: '#F4F7FB',
            100: '#D5E2F0',
            200: '#ABC5E1',
            300: '#81A8D2',
            400: '#578BC3',
            500: '#1B4B7A',
            600: '#174068',
            700: '#133556',
            800: '#0F2A44',
            900: '#0B1F32'
          },
          usage: 'Trust, stability, water elements'
        }
      ]
    },
    neutrals: {
      title: "Neutral Colors",
      colors: [
        {
          name: 'Slate',
          base: '#212120',
          shades: {
            50: '#F5F5F5',
            100: '#E6E6E6',
            200: '#CCCCCC',
            300: '#B3B3B3',
            400: '#999999',
            500: '#212120',
            600: '#1C1C1B',
            700: '#171716',
            800: '#121211',
            900: '#0D0D0C'
          },
          usage: 'Primary text, deep backgrounds'
        },
        {
          name: 'Mist',
          base: '#D2DDDE',
          shades: {
            50: '#FCFDFD',
            100: '#F5F8F8',
            200: '#EBF1F1',
            300: '#E1E9EA',
            400: '#D7E1E2',
            500: '#D2DDDE',
            600: '#A7B9BB',
            700: '#7D9598',
            800: '#537074',
            900: '#294C51'
          },
          usage: 'Borders, dividers, subtle backgrounds'
        }
      ]
    },
    feedback: {
      title: "Feedback Colors",
      colors: [
        {
          name: 'Ruby Red',
          base: '#9A1B22',
          shades: {
            50: '#FEF4F5',
            100: '#FBD7D9',
            200: '#F7AFB3',
            300: '#F3878D',
            400: '#EF5F67',
            500: '#9A1B22',
            600: '#83171D',
            700: '#6C1318',
            800: '#550F13',
            900: '#3E0B0E'
          },
          usage: 'Error messages, validation, alerts'
        },
        {
          name: 'Success Green',
          base: '#2D7A3F',
          shades: {
            50: '#F5FAF6',
            100: '#DCF0E0',
            200: '#B9E1C1',
            300: '#96D2A2',
            400: '#73C383',
            500: '#2D7A3F',
            600: '#266835',
            700: '#1F562B',
            800: '#184421',
            900: '#113217'
          },
          usage: 'Success messages, confirmations'
        }
      ]
    }
  },
  title = "Bhopal Design Festival Extended Color Palette"
}: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#460E2F');
  const [contrastColor, setContrastColor] = useState<string>('#FFFFFF');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'analogous' | 'triadic'>('complementary');
  const [colorNames, setColorNames] = useState<{[key: string]: string}>({});
  const [colorCombinations, setColorCombinations] = useState<string[]>([]);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const contrastRatio = calculateContrastRatio(selectedColor, contrastColor);

  const getColorHarmony = () => {
    switch (harmonyType) {
      case 'complementary':
        return [getComplementaryColor(selectedColor)];
      case 'analogous':
        return getAnalogousColors(selectedColor);
      case 'triadic':
        return getTriadicColors(selectedColor);
      default:
        return [];
    }
  };

  const harmonyColors = getColorHarmony();

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchColorNames = async () => {
      const names: {[key: string]: string} = {};
      for (const category of Object.values(colorPalettes)) {
        for (const color of category.colors) {
          names[color.base] = await getColorName(color.base);
        }
      }
      setColorNames(names);
    };

    fetchColorNames();
  }, [colorPalettes]);

  useEffect(() => {
    setColorCombinations(getColorCombinations(selectedColor));
  }, [selectedColor]);

  return (
    <TooltipProvider>
      <Card className={`w-full max-w-5xl ${isDarkMode ? 'dark' : ''}`}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-6 h-6 text-primary" />
              <CardTitle>{title}</CardTitle>
            
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-primary">Simple Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Primary</h4>
                <div
                  className="relative w-full h-16 rounded cursor-pointer transition-transform hover:scale-105 group"
                  onClick={() => {
                    handleCopyColor(colorPalettes.primary.colors[0].shades[500]);
                    setSelectedColor(colorPalettes.primary.colors[0].shades[500]);
                  }}
                >
                  <div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: colorPalettes.primary.colors[0].shades[500] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                    <span className="text-white text-sm font-medium">{colorPalettes.primary.colors[0].name}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Secondary 1</h4>
                <div
                  className="relative w-full h-16 rounded cursor-pointer transition-transform hover:scale-105 group"
                  onClick={() => {
                    handleCopyColor(colorPalettes.secondary.colors[0].shades[500]);
                    setSelectedColor(colorPalettes.secondary.colors[0].shades[500]);
                  }}
                >
                  <div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: colorPalettes.secondary.colors[0].shades[500] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                    <span className="text-white text-sm font-medium">{colorPalettes.secondary.colors[0].name}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Secondary 2</h4>
                <div
                  className="relative w-full h-16 rounded cursor-pointer transition-transform hover:scale-105 group"
                  onClick={() => {
                    handleCopyColor(colorPalettes.accent.colors[0].shades[500]);
                    setSelectedColor(colorPalettes.accent.colors[0].shades[500]);
                  }}
                >
                  <div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: colorPalettes.accent.colors[0].shades[500] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                    <span className="text-white text-sm font-medium">{colorPalettes.accent.colors[0].name}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tertiary (Highlight)</h4>
                <div
                  className="relative w-full h-16 rounded cursor-pointer transition-transform hover:scale-105 group"
                  onClick={() => {
                    handleCopyColor(colorPalettes.accent.colors[1].shades[500]);
                    setSelectedColor(colorPalettes.accent.colors[1].shades[500]);
                  }}
                >
                  <div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: colorPalettes.accent.colors[1].shades[500] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                    <span className="text-white text-sm font-medium">{colorPalettes.accent.colors[1].name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {Object.entries(colorPalettes).map(([category, { title, colors }]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">{title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colors.map((colorSet, idx) => (
                  <div key={idx} className="space-y-4 bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-lg">{colorSet.name}</h4>
                      <p className="text-sm text-muted-foreground">{colorSet.usage}</p>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {Object.entries(colorSet.shades).map(([shade, hex]) => (
                        <Tooltip key={shade}>
                          <TooltipTrigger asChild>
                            <div className="space-y-1">
                              <div
                                className="w-full h-8 rounded cursor-pointer transition-transform hover:scale-105 relative"
                                style={{ backgroundColor: hex }}
                                onClick={() => {
                                  handleCopyColor(hex);
                                  setSelectedColor(hex);
                                }}
                                aria-label={`Select color ${hex}`}
                              >
                                {copiedColor === hex && 
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                    <Check className="text-white" size={16} />
                                  </div>
                                }
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-mono text-muted-foreground">{shade}</div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>{copiedColor === hex ? "Copied!" : "Click to select"}</div>
                            <div>{hex}</div>
                            <div>{colorNames[hex] || 'Loading...'}</div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Color Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-card rounded-lg border p-4">
                <h4 className="font-medium text-lg">Contrast Checker</h4>
                <div className="flex space-x-4">
                  <div>
                    <Label htmlFor="color1">Color 1</Label>
                    <input
                      type="color"
                      id="color1"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="block mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color2">Color 2</Label>
                    <input
                      type="color"
                      id="color2"
                      value={contrastColor}
                      onChange={(e) => setContrastColor(e.target.value)}
                      className="block mt-1"
                    />
                  </div>
                </div>
                <div>
                  <p>Contrast Ratio: {contrastRatio}</p>
                  <p>
                    {contrastRatio >= 4.5
                      ? "Passes AA standard for normal text"
                      : "Does not pass AA standard for normal text"}
                  </p>
                </div>
              </div>
              <div className="space-y-4 bg-card rounded-lg border p-4">
                <h4 className="font-medium text-lg">Color Harmony</h4>
                <Select onValueChange={(value) => setHarmonyType(value as 'complementary' | 'analogous' | 'triadic')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select harmony type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complementary">Complementary</SelectItem>
                    <SelectItem value="analogous">Analogous</SelectItem>
                    <SelectItem value="triadic">Triadic</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <div
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                  {harmonyColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-card rounded-lg border p-4">
            <h4 className="font-medium text-lg">Color Combination Suggestions</h4>
            <p className="text-sm text-muted-foreground">Based on the selected color: {selectedColor}</p>
            <div className="flex flex-wrap gap-2">
              {colorCombinations.map((color, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-10 h-10 rounded cursor-pointer"
                      style={{ backgroundColor: color }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>{color}</div>
                    <div>{colorNames[color] || 'Loading...'}</div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <Info className="inline-block mr-1" size={16} />
              These colors are suggested based on color theory principles including complementary, triadic, and analogous relationships.
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Usage Guidelines:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Use Royal Purple (#460E2F) as the primary brand color for main elements in both digital and print materials</li>
              <li>Sunset Orange (#F68B29) should be reserved for important call-to-actions and highlight areas in posters and digital interfaces</li>
              <li>Forest Green and Ocean Blue can be used for supporting elements, section backgrounds, and to represent nature or water themes in graphic work</li>
              <li>Use the neutral palette for text, borders, and subtle backgrounds in both digital and print designs</li>
              <li>Feedback colors should be used sparingly and only for their intended purposes in both digital interfaces and informational posters</li>
              <li>Consider accessibility and maintain sufficient contrast ratios, especially important for both digital and print materials</li>
              <li>When designing posters or large format prints, use color combinations that are visually striking from a distance</li>
              <li>For graphic work, experiment with overlaying colors or using gradients to create depth and visual interest</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}