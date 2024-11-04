'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush, Copy } from 'lucide-react';

export function ColorPalette() {
  const colorPalettes = {
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
            500: '#460E2F', // base
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
            500: '#F68B29', // base
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
            500: '#2A5A3B', // base
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
            500: '#1B4B7A', // base
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
            500: '#212120', // base
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
            500: '#D2DDDE', // base
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
            500: '#9A1B22', // base
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
            500: '#2D7A3F', // base
            600: '#266835',
            700: '#1F562B',
            800: '#184421',
            900: '#113217'
          },
          usage: 'Success messages, confirmations'
        }
      ]
    }
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-6 h-6 text-[#460E2F]" />
          <CardTitle>Bhopal Design Festival Color Palette</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {Object.entries(colorPalettes).map(([category, { title, colors }]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-[#460E2F]">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colors.map((colorSet, idx) => (
                <div key={idx} className="space-y-4 bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">{colorSet.name}</h4>
                    <p className="text-sm text-gray-600">{colorSet.usage}</p>
                  </div>
                  <div className="grid grid-cols-10 gap-1">
                    {Object.entries(colorSet.shades).map(([shade, hex]) => (
                      <div key={shade} className="space-y-1">
                        <div
                          className="w-full h-8 rounded cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: hex }}
                          onClick={() => handleCopyColor(hex)}
                          title={`Click to copy: ${hex}`}
                        />
                        <div className="text-center">
                          <div className="text-xs font-mono text-gray-600">{shade}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#460E2F]">Gradient Combinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-medium">Primary Gradient</p>
              <div className="h-16 rounded-lg bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Ocean Gradient</p>
              <div className="h-16 rounded-lg bg-gradient-to-r from-[#1B4B7A] via-[#2A5A3B] to-[#F68B29]" />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Usage Guidelines:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Use Royal Purple (#460E2F) as the primary brand color for main elements</li>
            <li>Sunset Orange (#F68B29) should be reserved for important call-to-actions</li>
            <li>Forest Green and Ocean Blue can be used for supporting elements and section backgrounds</li>
            <li>Use the neutral palette for text, borders, and subtle backgrounds</li>
            <li>Feedback colors should be used sparingly and only for their intended purposes</li>
            <li>Consider accessibility and maintain sufficient contrast ratios</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}