import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { document } from '@/lib/document-parser';
import { Plus, Menu, Edit2, Trash2, Upload, FileText, Copy, AlertCircle, CheckCircle } from 'lucide-react';

interface MenuItem {
  id: string;
  item_name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
}

export const EnhancedMenuManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [bulkText, setBulkText] = useState('');

  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    is_available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, [user]);

  const fetchMenuItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('customer_id', user.id)
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      const itemData = {
        customer_id: user.id,
        item_name: formData.item_name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_available: formData.is_available,
      };

      let error;
      if (editingItem) {
        ({ error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id));
      } else {
        ({ error } = await supabase
          .from('menu_items')
          .insert([itemData]));
      }

      if (error) throw error;

      toast({
        title: editingItem ? 'Item updated' : 'Item added',
        description: `Menu item has been ${editingItem ? 'updated' : 'added'} successfully.`,
      });

      handleCloseDialog();
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      setUploadProgress(30);

      // Parse the document if it's a PDF
      if (file.type === 'application/pdf') {
        setUploadProgress(50);
        const parsedContent = await document.parseDocument(file);
        setUploadProgress(80);
        
        // Extract menu items from parsed content (simplified parsing logic)
        const items = parseMenuFromText(parsedContent.text);
        setParsedItems(items);
        setUploadProgress(100);
        
        toast({
          title: 'File parsed successfully',
          description: `Found ${items.length} menu items. Review and save them below.`,
        });
      } else {
        setUploadProgress(100);
        toast({
          title: 'File uploaded',
          description: 'File uploaded successfully. Please parse manually or upload a PDF for automatic parsing.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const parseMenuFromText = (text: string): ParsedMenuItem[] => {
    const items: ParsedMenuItem[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentCategory = 'Uncategorized';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if line is a category (usually in caps or has specific formatting)
      if (trimmedLine.match(/^[A-Z\s]+$/) && trimmedLine.length > 2 && trimmedLine.length < 30) {
        currentCategory = trimmedLine.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        return;
      }
      
      // Check if line contains a price pattern
      const priceMatch = trimmedLine.match(/(.+?)[\s\.\-]+\$?(\d+\.?\d*)/);
      if (priceMatch) {
        const name = priceMatch[1].trim();
        const price = parseFloat(priceMatch[2]);
        
        if (name && price > 0) {
          items.push({
            name,
            description: '',
            price,
            category: currentCategory
          });
        }
      }
    });
    
    return items;
  };

  const handleBulkTextParse = () => {
    const items = parseMenuFromText(bulkText);
    setParsedItems(items);
    toast({
      title: 'Text parsed',
      description: `Found ${items.length} menu items from your text.`,
    });
  };

  const saveParsedItems = async () => {
    if (!user || parsedItems.length === 0) return;

    setSubmitting(true);
    try {
      const itemsToInsert = parsedItems.map(item => ({
        customer_id: user.id,
        item_name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        is_available: true,
      }));

      const { error } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);

      if (error) throw error;

      toast({
        title: 'Items saved',
        description: `Successfully added ${parsedItems.length} menu items.`,
      });

      setParsedItems([]);
      setBulkText('');
      setUploadDialogOpen(false);
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || '',
      is_available: item.is_available,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Item deleted',
        description: 'Menu item has been deleted successfully.',
      });

      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.is_available })
        .eq('id', item.id);

      if (error) throw error;
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      item_name: '',
      description: '',
      price: '',
      category: '',
      is_available: true,
    });
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setParsedItems([]);
    setBulkText('');
    setUploadProgress(0);
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Enhanced Menu Management</h3>
          <p className="text-muted-foreground">Upload PDF menus, copy-paste text, or manually add items</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload or Import Menu</DialogTitle>
                <DialogDescription>
                  Upload a PDF menu file or paste your menu text for automatic parsing
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* File Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Upload PDF Menu</span>
                    </CardTitle>
                    <CardDescription>
                      Upload a PDF file and we'll automatically extract menu items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} />
                          <p className="text-sm text-muted-foreground">
                            {uploadProgress < 30 ? 'Uploading...' :
                             uploadProgress < 80 ? 'Parsing document...' : 'Finalizing...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Copy-Paste Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Copy className="h-5 w-5" />
                      <span>Copy & Paste Menu</span>
                    </CardTitle>
                    <CardDescription>
                      Paste your menu text and we'll try to extract items automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste your menu here...&#10;&#10;APPETIZERS&#10;Garlic Bread ... $6.99&#10;Caesar Salad ... $8.99&#10;&#10;MAIN COURSES&#10;Margherita Pizza ... $12.99&#10;Chicken Alfredo ... $15.99"
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <Button onClick={handleBulkTextParse} disabled={!bulkText.trim()}>
                        Parse Menu Text
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Parsed Items Preview */}
                {parsedItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Parsed Menu Items ({parsedItems.length})</span>
                      </CardTitle>
                      <CardDescription>
                        Review the extracted items below and save them to your menu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {parsedItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {parsedItems.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Review the parsed items above. You can always edit individual items after saving.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseUploadDialog}>
                  Cancel
                </Button>
                {parsedItems.length > 0 && (
                  <Button onClick={saveParsedItems} disabled={submitting}>
                    Save {parsedItems.length} Items
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the menu item details' : 'Add a new item to your menu'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., Margherita Pizza"
                    value={formData.item_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the menu item..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Pizza, Drinks"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {Object.keys(groupedItems).length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No menu items yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload a PDF menu, copy-paste your menu, or add items manually
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Menu
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category} className="glass-card">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{items.length} items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className={`border transition-all hover:shadow-lg ${!item.is_available ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{item.item_name}</h4>
                              <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.is_available 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </span>
                            <Switch
                              checked={item.is_available}
                              onCheckedChange={() => handleToggleAvailability(item)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};