import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Adaptive() {
  return (
    <div className="min-h-screen grid-pattern p-4">
      <div className="container max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link to="/"><Button variant="ghost">← Back</Button></Link>
          <h1 className="text-2xl font-bold text-gradient">Adaptive Learning</h1>
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>AI-Powered Difficulty</CardTitle>
              <CardDescription>Questions adapt to your skill level</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-6">🧠</div>
              <p className="text-muted-foreground mb-6">
                IRT-based adaptive engine coming in Phase 2
              </p>
              <Link to="/quiz"><Button className="bg-gradient-primary">Try Standard Quiz</Button></Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
