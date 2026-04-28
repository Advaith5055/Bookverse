import { Shield, AlertCircle, Tag, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SafetyTips = () => {
  return (
    <div className="space-y-6">
      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Meet in public, well-lit spaces for exchanges
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Verify book condition before finalizing
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Set clear return dates for borrowed books
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Use secure payment methods for sales
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fee Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5 text-primary" />
            Platform Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Regular Listings</span>
            <span className="font-semibold text-foreground">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sale Transactions</span>
            <span className="font-semibold text-foreground">5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Featured Listings</span>
            <span className="font-semibold text-foreground">$2.99</span>
          </div>
        </CardContent>
      </Card>

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
            Quick Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Be honest about book condition</p>
          <p>• Respond promptly to inquiries</p>
          <p>• Honor your commitments</p>
          <p>• Report suspicious activity</p>
          <p>• Respect copyright laws</p>
        </CardContent>
      </Card>
    </div>
  );
};
