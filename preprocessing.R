
#read in data

df <- read_csv(here("data", "Bingfall24.csv")) |> filter(!is.na(response))
df$mean_age <- df$`age (months)` - mean(df$`age (months)`)
df <- df %>% mutate (b_response = case_when(response == "shape" ~ 1, .default = 0))

# rename columns and adding condition order 
df <- df %>%
  rename(age_mo = `age (months)`, age_yr = `age (years)`)

df <- df %>%
  group_by(kidid) %>%
  mutate(cond_order = if_else(first(condition) == "material", "material", "function")) %>%
  ungroup()

# age bins
df <- df %>%
  mutate(age_group = case_when(
    age_mo < 25 ~ "<=2",
    age_mo >= 25 & age_mo < 37 ~ "<=3",
    age_mo >= 37 & age_mo < 48 ~ "<=4",
    TRUE ~ "<5"
  ))


df <- df %>%
  filter(age_yr != 124.83) %>%
  mutate(age_yr_bin = cut(age_mo, 
                          breaks = seq(24, 72, by = 12), 
                          right = FALSE, 
                          labels = c("2", "3", "4", "5")))

df <- df %>% filter(response != "material" | condition != "function")

age_summary <- df %>%
  distinct(age_yr_bin, kidid) %>%  
  group_by(age_yr_bin) %>%
  summarise(n_kids = n())  

# means per participant
# 
# kid_means <- df %>% 
#   group_by(kidid, age_mo, condition, age_group, cond_order) %>% 
#   summarize(s.mean = mean(as.numeric(response == "shape"))), 
#             m.mean = mean(as.numeric(response == "material")), 
#             d.mean = mean(as.numeric(response == "distractor")), 
#             f.mean = mean(as.numeric(response == "function")) ) %>% 
#   mutate(cond_order = first(cond_order)) %>% 
#   ungroup()
# 
# kid_means_long <- kid_means %>% pivot_longer(cols = c("s.mean", "m.mean", "d.mean", "f.mean") , names_to = "response", values_to = "proportions" )

# kid_means_long <- kid_means_long %>%
#   left_join(df %>% select(kidid, cond_order) %>% distinct(), by = "kidid") %>%
#   select(-ends_with(".y")) %>%
#   ungroup() %>% 
#   rename(cond_order = cond_order.x) 

# Summarize data to ensure one row per kidid per condition
# cleaned_data <- kid_means %>%
#   group_by(kidid, age_mo, age_group, cond_order, condition) %>%
#   summarize(s.mean = mean(s.mean, na.rm = TRUE), .groups = "drop")
# 
# # Pivot wider
# diff <- cleaned_data %>%
#   pivot_wider(
#     names_from = condition, 
#     values_from = s.mean,
#     names_prefix = "s.mean_"
#   ) %>% mutate(diff = s.mean_function - s.mean_material)


# kid_means <- kid_means %>%
#   group_by(age_group, condition) %>%
#   summarize(
#     shape_mean = mean(s.mean),
#     shape_se = sd(s.mean) / sqrt(n()),
#     material_mean = mean(m.mean),
#     material_se = sd(m.mean) / sqrt(n()),
#     distractor_mean = mean(d.mean),
#     distractor_se = sd(d.mean) / sqrt(n()),
#     function_mean = mean(f.mean),
#     function_se = sd(f.mean) / sqrt(n()),
#   )

df_c <- df %>%
  mutate(standardlabel = str_remove(standardlabel, "^the\\s"))

plot_data_c <- df_c  %>%
  group_by(condition, standardlabel, response) %>%
  summarise(count = n(), .groups = 'drop') %>%
  group_by(condition, standardlabel) %>%
  mutate(percent = count / sum(count) * 100)