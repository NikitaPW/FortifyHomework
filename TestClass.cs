// NUnit 3 tests
// See documentation : https://github.com/nunit/docs/wiki/NUnit-Documentation
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace FortHW
{
    [TestFixture]
    public class TestClass : BaseClass
    {
        [Test,Category("Functionality Tests")]
        public void AddContact1()
        {
            log.Info("Test. Adding contact...");

            try
            {
                // filling the form
                IWebElement nameField = driver.FindElement(By.Id("name"));
                nameField.SendKeys("Nikita Zakharov");
                IWebElement phoneField = driver.FindElement(By.Id("phone"));
                phoneField.SendKeys("+48 796 157 548");

                // submitting form
                driver.FindElement(By.XPath("//input[@type='submit']")).Click();

                // check the displayed new element
                Assert.IsTrue(driver.FindElement(By.XPath("//td[text()='Nikita Zakharov']")).Displayed);
                Assert.IsTrue(driver.FindElement(By.XPath("//td[text()='+48 796 157 548']")).Displayed);
                log.Info("Test. Contact is added");
            }
            catch (Exception)
            {
                log.Error("Contact is not added");
            }

            Thread.Sleep(1000);
        }

        [Test, Category("Functionality Tests")]
        public void AddContact2()
        {
            log.Info("Test. Adding contact...");

            // filling the form
            try
            {
                IWebElement nameField = driver.FindElement(By.Id("name"));
                nameField.SendKeys("Jhon Smith");
                IWebElement phoneField = driver.FindElement(By.Id("phone"));
                phoneField.SendKeys("+420 123 456 789");

                // submitting form
                driver.FindElement(By.XPath("//input[@type='submit']")).Click();

                // check the displayed new element
                Assert.IsTrue(driver.FindElement(By.XPath("//td[text()='Jhon Smith']")).Displayed);
                Assert.IsTrue(driver.FindElement(By.XPath("//td[text()='+420 123 456 789']")).Displayed);
                log.Info("Contact is added");
            }
            catch (Exception)
            {
                log.Error("Contact is not added");
            }

            Thread.Sleep(1000);
        }

        [Test, Category("Functionality Tests")]
        public void DeleteContact()
        {
            log.Info("Test. Deleting contact...");

            // deleteing contact
            driver.FindElement(By.XPath("//td[contains(text(),'Jhon Smith')]/..//td[3]//button")).Click();

            try
            {
                // checking name on the page
                Assert.IsFalse(driver.FindElement(By.XPath("//td[text()='Jhon Smith']")).Displayed);
                log.Error("Element with name is present on the page. Test is failed.");
            } 
            catch (NoSuchElementException)
            {
                log.Info("Name is not present on the page.");
            }
            
            try
            {
                // checking phone on the page
                Assert.IsFalse(driver.FindElement(By.XPath("//td[text()='+420 123 456 789']")).Displayed);
                log.Error("Element with name is present on the page. Test is failed.");
            }
            catch (NoSuchElementException)
            {
                log.Info("Phone is not present on the page.");
            }

            Thread.Sleep(1000);
        }

        [Test, Category("Validation Tests")]
        public void TestEmptyFields()
        {
            log.Info("Test. Empty Fields");

            try
            {
                // add contact with empty fields on the page
                driver.FindElement(By.XPath("//input[@type='submit']")).Click();
                Assert.IsTrue(driver.FindElement(By.XPath("//div[text()='Please, fill in all the fields']")).Displayed);
                log.Info("Success. The alert is displayed.");
            }
            catch (Exception)
            {
                log.Error("he alert is not displayed.");
            }

            Thread.Sleep(1000);
        }

        [Test, Category("Validation Tests")]
        public void TestWrongPhoneFormat()
        {
            log.Info("Test. Wrong Phone Number");

            try
            {
                log.Info("Passing wrong number to the form");
                // add contact with wrong format phone number
                IWebElement nameField = driver.FindElement(By.Id("name"));
                nameField.SendKeys("Elizabeth Smith");
                IWebElement phoneField = driver.FindElement(By.Id("phone"));
                phoneField.SendKeys("+48 1234 123 12");
                driver.FindElement(By.XPath("//input[@type='submit']")).Click();
                Assert.IsTrue(driver.FindElement(By.XPath("//div[text()='The number is ill formatted']")).Displayed);
                log.Info("The alert on wrong number is displayed.");
            }
            catch (Exception)
            {
                log.Error("The alert is not displayed.");
            }

            Thread.Sleep(1000);
        }
    }
}
