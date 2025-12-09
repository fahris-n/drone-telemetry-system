# Use an official Python image as the base
FROM python:3.11-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the simulation script into the container
COPY simulate_drone.py .

# Create logs directory
RUN mkdir -p /app/logs

# Install any dependencies (if you have a requirements.txt, otherwise skip this)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set the default command to run the simulation
CMD ["python", "simulate_drone.py"]
