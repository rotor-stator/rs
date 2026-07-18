-- Product pages are now looked up by part_number (see /product/[partNumber]),
-- so two products sharing a part_number would collide/resolve to the wrong page.
alter table products add constraint products_part_number_key unique (part_number);
