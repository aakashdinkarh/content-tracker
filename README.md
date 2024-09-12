# **Content Tracker [Chrome Extension**]

A Chrome extension that tracks specified content on a webpage in real-time and sends a browser notification when the content appears. The extension also allows the user to focus on the relevant tab by clicking the notification. This extension is ideal for monitoring dynamic web pages where content updates frequently.

## **Features**
- **Real-time Content Tracking**: Monitor specific text on a webpage.
- **Notifications**: Receive a browser notification when the tracked content appears.
- **Tab Focus**: Automatically switch to the tab that triggered the notification when the notification is clicked.
- **Sound Alerts**: Play an audio alert with the notification.
- **Customizable Tracking**: Users can input their own text to track.

## **Installation**

### **Method 1: Clone the Repository**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/aakashdinkarh/content-tracker.git
   ```
2. **Go to Chrome Extensions**:
   1. Open Chrome and navigate to `chrome://extensions/`.
   2. Enable **Developer mode** (toggle in the top-right corner).
   3. Click **Load unpacked** and select the folder where you cloned the repository.

### **Method 2: Install from ZIP File**
1. **Download the ZIP file**:
   1. Go to the [repository page](https://github.com/aakashdinkarh/content-tracker).
   2. Click on the **Code** button and select **Download ZIP**.
   
2. **Extract the ZIP**:
   - Extract the downloaded ZIP file to a directory on your computer.

3. **Go to Chrome Extensions**:
   1. Open Chrome and navigate to `chrome://extensions/`.
   2. Enable **Developer mode** (toggle in the top-right corner).
   3. Click **Load unpacked** and select the folder where you extracted the ZIP file.

## **Start Tracking**:
   - Click on the extension icon in your browser.
   - Enter the content you want to track in the input field and click **Start Tracking**.

## **Usage**
1. Open a webpage where you'd like to monitor content.
2. Enter the text you'd like to track in the extension popup.
3. The extension will continuously observe the webpage, and when the specified content appears:
   - You will receive a browser notification.
   - Clicking the notification will bring focus to the corresponding tab.
   - A sound alert will also be played (if enabled).

## **Permissions**
The extension requests the following permissions:
- **Storage**: To store the user’s tracking preferences.
- **Active Tab**: To execute tracking scripts on the active webpage.
- **Notifications**: To display notifications when tracked content appears.

## **How It Works**
- The extension uses the **MutationObserver** API to monitor changes on the webpage.
- When the specified content is found, a browser notification is triggered, and the observer is automatically disconnected.

## **Contributing**
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

You can adjust the **repo URL** and any other specifics as needed. This README includes installation, usage, and contributing instructions, making it clear for others to use or contribute to the project.
