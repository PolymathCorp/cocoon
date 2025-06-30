-- This script will be run after user authentication is set up
-- It creates default categories for new users

-- Function to create default categories for a new user
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Default expense categories
    INSERT INTO categories (user_id, name, type, icon) VALUES
    (user_uuid, 'Food & Dining', 'expense', '🍽️'),
    (user_uuid, 'Transportation', 'expense', '🚗'),
    (user_uuid, 'Shopping', 'expense', '🛍️'),
    (user_uuid, 'Entertainment', 'expense', '🎬'),
    (user_uuid, 'Bills & Utilities', 'expense', '💡'),
    (user_uuid, 'Healthcare', 'expense', '🏥'),
    (user_uuid, 'Education', 'expense', '📚'),
    (user_uuid, 'Travel', 'expense', '✈️');
    
    -- Default income categories
    INSERT INTO categories (user_id, name, type, icon) VALUES
    (user_uuid, 'Salary', 'income', '💼'),
    (user_uuid, 'Freelance', 'income', '💻'),
    (user_uuid, 'Investment', 'income', '📈'),
    (user_uuid, 'Other Income', 'income', '💰');
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_categories(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
