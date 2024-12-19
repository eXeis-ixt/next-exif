'use client'

import { useState, useCallback } from 'react'
import ExifReader from 'exifreader'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Image, Upload, Shield, Zap, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Navbar } from './navbar'

interface ExifData {
  [key: string]: any
}

export default function ExifChecker() {
  const [exifData, setExifData] = useState<ExifData | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = async (file: File) => {
    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const tags = await ExifReader.load(file)
      if (Object.keys(tags).length === 0) {
        setError('No EXIF metadata found in this image')
        setExifData(null)
      } else {
        const formattedExif = Object.entries(tags).reduce((acc, [key, value]) => {
          if (key === 'MakerNote' || key === 'UserComment' || key.startsWith('Thumbnail')) {
            return acc
          }
          if (value && typeof value === 'object' && 'description' in value) {
            acc[key] = value.description
          } else {
            acc[key] = value
          }
          return acc
        }, {} as ExifData)

        setExifData(formattedExif)
      }
    } catch (err) {
      setError('Error reading EXIF data')
      console.error(err)
      setExifData(null)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    } else {
      setError('Please upload a valid image file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  })

  const formatExifValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A'
    if (value instanceof Array) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-50" />
        </div>
        <Badge variant="secondary" className="mb-4">
          Secure & Private
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          EXIF Metadata Viewer
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Instantly analyze and view EXIF metadata from your images. 
          Professional-grade tools for photographers and developers.
        </p>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <Card className="bg-background/50 backdrop-blur transition-all hover:bg-background/80 hover:shadow-lg">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 mb-3 mx-auto text-primary" />
              <h3 className="font-semibold mb-2">Secure Analysis</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Your images never leave your device.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur transition-all hover:bg-background/80 hover:shadow-lg">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 mb-3 mx-auto text-primary" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed EXIF data analysis in milliseconds.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur transition-all hover:bg-background/80 hover:shadow-lg">
            <CardContent className="pt-6">
              <Lock className="w-8 h-8 mb-3 mx-auto text-primary" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                No data storage, no cookies, just pure functionality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Upload Card */}
        <Card className="bg-background/50 backdrop-blur border-primary/20 relative before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-b before:from-primary/20 before:to-primary/0 before:blur-xl">
          <CardHeader>
            <CardTitle>Upload Your Image</CardTitle>
            <CardDescription>
              Drag and drop or click to select an image for instant EXIF analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
                isDragActive 
                  ? "border-primary bg-primary/5 scale-98" 
                  : "border-muted-foreground/25",
                "hover:border-primary hover:bg-primary/5"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag and drop an image here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports JPG, PNG, and other common image formats
              </p>
            </div>

            {error && (
              <p className="text-destructive text-center bg-destructive/10 py-2 px-4 rounded-lg">
                {error}
              </p>
            )}

            {/* Image Preview and EXIF Data */}
            {imagePreview && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <Card className="bg-background/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* EXIF Data */}
                <Card className="bg-background/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      EXIF Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      {exifData ? (
                        <div className="space-y-4">
                          {Object.entries(exifData).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-sm font-medium">{key}</span>
                                <span className="text-sm text-muted-foreground text-right">
                                  {formatExifValue(value)}
                                </span>
                              </div>
                              <Separator className="mt-2" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No EXIF data available
                        </p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Adons Tech</span>
              <div className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Beta
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built with privacy and security in mind. Your images are processed locally.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Adons Tech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

