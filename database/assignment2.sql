-- Create test user
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update test user
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';
-- Delete test User
DELETE FROM public.account
WHERE account_firstname = 'Tony';
-- Update inventory description
UPDATE public.inventory
SET inv_description = REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_model = 'Hummer';
-- Inner Join 
SELECT inv_make,
    inv_model
FROM public.inventory
    INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';
-- Update file paths
UPDATE public.inventory
SET inv_image = REPLACE (
        inv_image,
        '/images',
        '/images/vehicles'
    ),
    inv_thumbnail = REPLACE (
        inv_thumbnail,
        '/images',
        '/images/vehicles'
    );