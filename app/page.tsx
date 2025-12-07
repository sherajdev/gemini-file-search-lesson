import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Database, FileText, Search, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Search className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Gemini File Search
              </span>
            </div>
            <Link href="/stores">
              <Button variant="outline" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Google Gemini AI</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            RAG-Powered Document Search
            <span className="block text-blue-600">With AI Citations</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            Upload your documents, ask questions in natural language, and get accurate answers
            with detailed citations. Built with Google&apos;s Gemini File Search API.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/stores">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/explorer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Key Features
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Upload Documents */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload PDFs, text files, and more. Configure custom chunking and metadata for
                optimal retrieval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag-and-drop file upload</li>
                <li>• Custom chunking configuration</li>
                <li>• Metadata tagging and filtering</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2: Ask Questions */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 border border-green-100">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Ask Questions</CardTitle>
              <CardDescription>
                Query your documents using natural language. Get AI-generated answers with
                grounding in your uploaded content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Natural language queries</li>
                <li>• Multi-store searches</li>
                <li>• Advanced metadata filtering</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3: View Citations */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 border border-purple-100">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>View Citations</CardTitle>
              <CardDescription>
                Explore detailed citations showing exactly where each answer came from in your
                documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Grounded answers with sources</li>
                <li>• Full-text citation explorer</li>
                <li>• Export to JSON/CSV/Markdown</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to get started?</CardTitle>
            <CardDescription className="text-base">
              Create your first file search store and start querying your documents with AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/stores">
              <Button size="lg">
                Create Your First Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built with Next.js and Google&apos;s Gemini File Search API
          </p>
        </div>
      </footer>
    </div>
  );
}
