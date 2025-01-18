

library("knitr")        # for knitting RMarkdown 
library("kableExtra")   # for making nice tables
library("janitor")      # for cleaning column names
library("broom.mixed")  # for tidying up linear models 
library("patchwork")    # for making figure panels
library("lme4")         # for linear mixed effects models
library("tidyverse")    # for wrangling, plotting, etc. 
library(here)
library(stringr)


## import data



df_summer24 <- read_csv(here("JMZsummer24.csv")) |> filter(!is.na(response))

df_summer24 <- df_summer24 %>% mutate (b_response = case_when(response == "shape" ~ 1, .default = 0))

df_summer24<- df_summer24 %>% mutate(mean_age = age - mean(age))

shapecount <- df_summer24 %>% group_by(kidid) %>% filter (response == "shape")  

#%>% summarize (count = n())

responsecount <- df_summer24 %>% group_by(response) %>% summarize(count = n())

df_summer24 %>% summarize (s.mean = sum(as.numeric(response == "shape"))/n(), m.mean = sum(as.numeric(response == "material"))/n(), d.mean = sum(as.numeric(response == "distractor"))/n()) #across all trials

kid_means_summer24 <- df_summer24 %>% group_by(kidid, age) %>% summarize(s.mean = sum(as.numeric(response == "shape"))/7, m.mean = sum(as.numeric(response == "material"))/7,d.mean = sum(as.numeric(response == "distractor"))/7) %>% ungroup()
# kid_means <- kid_means[-c(7), ]

discrete_df_summer24 <- kid_means_summer24 %>%
  mutate(d_age = case_when(
    age < 25 ~ "<=2",
    age >= 25 & age < 37 ~ "<=3",
    age >= 37 & age < 48 ~ "<=4",
    TRUE ~ "<5"
  ))


# Step 1: Calculate means and standard errors
discrete_df_summer24 <- discrete_df_summer24 %>%
  group_by(d_age) %>%
  summarize(
    shape_mean = mean(s.mean),
    shape_se = sd(s.mean) / sqrt(n()),
    material_mean = mean(m.mean),
    material_se = sd(m.mean) / sqrt(n()),
    distractor_mean = mean(d.mean),
    distractor_se = sd(d.mean) / sqrt(n())
  )

discrete_df_summer24_long <- discrete_df_summer24 %>%
  pivot_longer(
    cols = c("shape_mean", "material_mean", "distractor_mean"),
    names_to = "response",
    values_to = "means"
  ) %>%
  mutate(
    se = case_when(
      response == "shape_mean" ~ shape_se,
      response == "material_mean" ~ material_se,
      response == "distractor_mean" ~ distractor_se
    )
  ) %>%
  select(-shape_se, -material_se, -distractor_se)  # Remove unnecessary columns

kid_means_long_summer24 <- kid_means_summer24 %>% pivot_longer(cols = c("s.mean", "m.mean", "d.mean") , names_to = "response", values_to = "proportions" )

gmodel1 <- glmer(b_response ~ age + (1 | standardlabel), 
      family = binomial(link = "logit"), data = df_summer24)

#Clean the standardlabel column
df_summer24 <- df_summer24 %>%
  mutate(standardlabel = str_remove(standardlabel, "^the\\s"))

# Calculate percentages
plot_data_summer24 <- df_summer24 %>%
  group_by(standardlabel, response) %>%
  summarise(count = n(), .groups = 'drop') %>%
  group_by(standardlabel) %>%
  mutate(percent = count / sum(count) * 100)


ggplot(data = plot_data_summer24, aes(x = standardlabel, y = percent, fill = response)) +
  geom_col(position = "stack", color = "black") +  # Stacked bar plot
  theme_minimal() +
  xlab("Standard Label") +
  ylab("Percentage") +
  labs(fill = "Response") +
  scale_fill_manual(
    values = c("brown", "darkgrey", "yellow4"),  # Custom colors
    labels = c("Distractor", "Material", "Shape")  # Legend labels
  ) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    legend.title = element_text(size = 12, face = "bold"),
    legend.text = element_text(size = 10),
    legend.position = "bottom",  # Place legend at the bottom
    panel.grid.major.y = element_line(color = "grey90")
  )
