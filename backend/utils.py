import subprocess
import json
import base64
import os
from typing import Dict, Any
import logging
import json
import os
import pandas as pd
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# For PDF filling
try:
    from fillpdf import fillpdfs
except ImportError:
    logger.warning("fillpdf package not found. Install with: pip install fillpdf")

# Set up logging
logger = logging.getLogger(__name__)

def exec_command(command: str) -> None:
    """Executes a shell command with proper error handling."""
    try:
        process = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        logger.info(f"Command output: {process.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed: {e.cmd}")
        logger.error(f"Error output: {e.stderr}")
        raise RuntimeError(f"Command execution failed: {str(e)}")

async def read_json_transcript(file_path: str) -> Dict[str, Any]:
    """Reads a JSON file with proper error handling."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in {file_path}: {str(e)}")
        return {}
    except Exception as e:
        logger.error(f"Unexpected error reading {file_path}: {str(e)}")
        return {}

async def audio_file_to_base64(file_path: str) -> str:
    """Converts audio file to base64 with proper error handling."""
    try:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        logger.error(f"Error reading audio file {file_path}: {str(e)}")
        return ""

def flatten_json(json_data, parent_key='', separator='_'):
    """
    Flatten a nested JSON structure into a single level dictionary.
    
    Args:
        json_data: The JSON data to flatten
        parent_key: Used for recursion, leave empty when calling
        separator: Separator between nested keys
        
    Returns:
        dict: Flattened dictionary
    """
    items = {}
    for key, value in json_data.items():
        new_key = f"{parent_key}{separator}{key}" if parent_key else key
        
        if isinstance(value, dict):
            items.update(flatten_json(value, new_key, separator))
        elif isinstance(value, list):
            # Convert list to string representation
            items[new_key] = json.dumps(value)
        else:
            items[new_key] = value
    return items

def save_json_to_excel(json_data, excel_file_path):
    """
    Save JSON data to an Excel file, appending to existing data.
    
    Args:
        json_data: JSON data to save
        excel_file_path: Path to the Excel file
    """
    flattened_data = flatten_json(json_data)
    
    # Create a DataFrame for the new row
    new_row_df = pd.DataFrame([flattened_data])
    
    # If the file exists, load existing data and append the new row
    if os.path.exists(excel_file_path):
        try:
            existing_df = pd.read_excel(excel_file_path)
            
            # Get all unique columns from both DataFrames
            all_columns = list(set(existing_df.columns).union(new_row_df.columns))
            
            # Reindex both DataFrames with the complete set of columns
            existing_df = existing_df.reindex(columns=all_columns)
            new_row_df = new_row_df.reindex(columns=all_columns)
            
            # For empty lists, use NA rather than [] to maintain consistency
            for col in new_row_df.columns:
                if isinstance(new_row_df[col].iloc[0], list) and len(new_row_df[col].iloc[0]) == 0:
                    new_row_df[col] = pd.NA
            
            # Append the new row to the existing DataFrame
            final_df = pd.concat([existing_df, new_row_df], ignore_index=True)
        except Exception as e:
            logger.error(f"Error reading existing Excel file: {e}")
            final_df = new_row_df
    else:
        # For new files, replace empty lists with NA
        for col in new_row_df.columns:
            if isinstance(new_row_df[col].iloc[0], list) and len(new_row_df[col].iloc[0]) == 0:
                new_row_df[col] = pd.NA
        final_df = new_row_df
    
    # Save the final DataFrame to Excel
    final_df.to_excel(excel_file_path, index=False)

def clear_json_structure(data: dict) -> dict:
    """
    Clear all data but maintain structure.
    
    Args:
        data: The JSON data to clear
        
    Returns:
        dict: A new dictionary with the same structure but empty values
    """
    if isinstance(data, dict):
        return {k: clear_json_structure(v) for k, v in data.items()}
    elif isinstance(data, list):
        return []
    elif isinstance(data, str):
        return ""
    elif isinstance(data, (int, float)):
        return None
    elif isinstance(data, bool):
        return False
    return None


def fill_pdf(data_dict, input_pdf_path):
    """
    Fill a PDF form with the provided data and save it in the current working directory.
    
    Args:
        data_dict (dict): Dictionary with form field names and values to fill
        input_pdf_path (str): Path to the fillable PDF form
        
    Returns:
        str: Path to the filled PDF
    """
    # Ensure the input file exists
    if not os.path.isfile(input_pdf_path):
        raise FileNotFoundError(f"Could not find the form PDF: {input_pdf_path}")
    
    # Fixed output filename in current working directory
    filled_pdf = os.path.join(os.getcwd(), "filled.pdf")
    
    # Write the filled PDF
    fillpdfs.write_fillable_pdf(input_pdf_path, filled_pdf, data_dict)
    logger.info(f"Filled form saved to {filled_pdf}")
    
    return filled_pdf


def send_email_with_pdf(pdf_path):
    """
    Send an email with a PDF attachment.
    
    Args:
        pdf_path (str): Path to the PDF file to attach
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    # Hardcoded email configuration
    sender_email = "mayacode91@gmail.com"
    sender_password = 'YOUR_EMAIL_PASSWORD'
    receiver_email = "mirco.giannini@mayacode.io"
    subject = "PDF Document from MayaCode"
    body = "Please find the attached PDF document.\n\nBest regards,\nMayaCode"
    
    # Create the email message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    
    # Attach the body of the email
    message.attach(MIMEText(body, "plain"))
    
    # Check if the PDF file exists
    if not os.path.exists(pdf_path):
        logger.error(f"Error: PDF file not found at {pdf_path}")
        return False
    
    try:
        # Open the PDF file in binary mode
        with open(pdf_path, "rb") as attachment_file:
            # Create a MIMEBase object
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment_file.read())
            
        # Encode the attachment in base64
        encoders.encode_base64(part)
        
        # Add header to tell the email client it's an attachment
        pdf_filename = os.path.basename(pdf_path)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename= {pdf_filename}",
        )
        
        # Attach the PDF part to the message
        message.attach(part)
        logger.info(f"Successfully attached '{pdf_filename}'")
        
        # Send the email
        smtp_server = "smtp.gmail.com"
        smtp_port = 587  # For TLS
        
        server = None
        logger.info(f"Connecting to SMTP server: {smtp_server}:{smtp_port}...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.ehlo()
        server.starttls()
        server.ehlo()
        
        server.login(sender_email, sender_password)
        logger.info("Successfully logged in")
        
        server.sendmail(sender_email, receiver_email, message.as_string())
        logger.info(f"Email sent successfully to {receiver_email}")
        return True
        
    except FileNotFoundError:
        logger.error(f"Error: PDF file not found at {pdf_path}")
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication Error: Failed to authenticate")
    except smtplib.SMTPServerDisconnected:
        logger.error("SMTP Server Disconnected: The server unexpectedly disconnected")
    except smtplib.SMTPConnectError:
        logger.error(f"SMTP Connect Error: Failed to connect to the server")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
    finally:
        if server:
            server.quit()
            logger.info("Closed SMTP connection")
    
    return False